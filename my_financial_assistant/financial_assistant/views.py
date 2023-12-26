from django.db import transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin, \
    ListModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet

from bank_api_imitation.models import Operation, BankProduct
from bank_api_imitation.serializers import OperationSerializer
from .logic.filters import filter_operations
from .permissions import ProfileOwnerPermission
from .logic.celery_tasks import send_code_to_email
from .logic.external_api_usage import convert_currency
from .logic.redis_functions import get_main_page_content, get_user_money
from .serializers import *


class MainPageView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_user = request.user
        return Response(get_main_page_content(current_user), status=200)


class OperationsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_bank_accounts = [account.bank for account in
                              FinancialAssistantBankAccount.objects.filter(user=request.user)]
        user_bank_products = BankProduct.objects.filter(bank_account__in=user_bank_accounts)
        user_operations = Operation.objects.filter(
            Q(sender__in=user_bank_products) | Q(recipient__in=user_bank_products)).order_by('-operation_date_time')

        filtered_operations = filter_operations(request, user_operations)
        serializer = OperationSerializer(filtered_operations, many=True)
        return Response(serializer.data, status=200)


class PersonalDataViewSet(CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [ProfileOwnerPermission]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            profile = self.perform_create(serializer)
            UserEmailConfirm.objects.create(user=profile, email_confirmed=True)
            CashInvoice.objects.create(user=profile, currency="RUB")
        return Response(serializer.data, status=201)

    def perform_create(self, serializer):
        return serializer.save()

    def retrieve(self, request, *args, **kwargs):
        current_user = self.get_object()
        serializer = self.get_serializer(current_user)
        response = serializer.data
        current_user_bank_accounts = FinancialAssistantBankAccount.objects.filter(user=current_user)
        current_user_bank_accounts_serializer = FinancialAssistantBankAccountSerializerForList(current_user_bank_accounts,
                                                                                        many=True)
        response['money'] = get_user_money(current_user)
        response['bank_accounts'] = current_user_bank_accounts_serializer.data
        return Response(response)


class BankAccountViewSet(CreateModelMixin, ListModelMixin, RetrieveModelMixin, DestroyModelMixin, GenericViewSet):
    queryset = FinancialAssistantBankAccount.objects.all()
    serializer_class = FinancialAssistantBankAccountSerializer
    #permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        bank_name = request.data['bank_name']
        email = request.data['email']
        bank_account_password = request.data['password']
        if BankAccount.objects.filter(bank__bank_name=bank_name, email=email,
                                      password=bank_account_password).exists():
            bank_account = BankAccount.objects.get(bank__bank_name=bank_name, email=email,
                                                   password=bank_account_password)
            created_account = FinancialAssistantBankAccount.objects.create(bank=bank_account, user=request.user)
            serializer = FinancialAssistantBankAccountSerializer(created_account)
            send_code_to_email(user=request.user, email=email, bank_account=bank_account)
            return Response(serializer.data, status=201)
        return Response(400)

    def list(self, request, *args, **kwargs):
        queryset = self.queryset.filter(user=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(methods=['post'], detail=True)
    def email_confirmation(self, request, pk=None):
        bank_account = get_object_or_404(FinancialAssistantBankAccount, pk=pk)
        code_from_request = request.data['confirmation_code']
        if code_from_request == bank_account.bank.access_key:
            bank_account.access_confirmed = True
            bank_account.save()
            return Response(200)
        return Response({"detail": "Неверный код"})


class FinancialGoalViewSet(CreateModelMixin, ListModelMixin, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin,
                           GenericViewSet):
    queryset = FinancialGoal.objects.all()
    serializer_class = FinancialGoalSerializer
    #permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        data = request.data
        data['user'] = request.user.id
        serializer = FinancialGoalSerializerCreateUpdate(data=data)
        serializer.is_valid(raise_exception=True)
        financial_goal = serializer.save()
        return Response(FinancialGoalSerializer(financial_goal).data, status=201)

    def list(self, request, *args, **kwargs):
        queryset = self.queryset.filter(user=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        response = serializer.data
        return Response(response)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data
        convert_to = request.data.get('currency')
        if instance.currency != convert_to:
            new_amount = convert_currency(instance.amount, instance.currency, convert_to)
            data['amount'] = new_amount
            data['currency'] = convert_to
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class CashInvoiceViewSet(CreateModelMixin, ListModelMixin, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin,
                         GenericViewSet):
    queryset = CashInvoice.objects.all()
    serializer_class = CashInvoiceSerializer
    #permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        data = request.data
        data['user'] = request.user.id
        serializer = CashInvoiceSerializerCreateUpdate(data=data)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            financial_goal = serializer.save()
        return Response(CashInvoiceSerializer(financial_goal).data, status=201)

    def list(self, request, *args, **kwargs):
        queryset = self.queryset.filter(user=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data
        convert_to = request.data.get('currency')
        if instance.currency != convert_to:
            new_amount = convert_currency(instance.amount, instance.currency, convert_to)
            data['amount'] = new_amount
            data['currency'] = convert_to
        data['user'] = request.user.pk
        serializer = CashInvoiceSerializerCreateUpdate(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            self.perform_update(serializer)
        return Response(serializer.data)


class RegularSpendingViewSet(CreateModelMixin, ListModelMixin, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin,
                             GenericViewSet):
    queryset = RegularSpending.objects.all()
    serializer_class = RegularSpendingSerializer
    #permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        data = request.data
        data['user'] = request.user.id
        serializer = RegularSpendingSerializerCreateUpdate(data=data)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            regular_spending = serializer.save()
        return Response(RegularSpendingSerializer(regular_spending).data, status=201)

    def list(self, request, *args, **kwargs):
        queryset = self.queryset.filter(user=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data
        convert_to = request.data.get('currency')
        if instance.currency != convert_to:
            new_amount = convert_currency(instance.amount, instance.currency, convert_to)
            data['amount'] = new_amount
            data['currency'] = convert_to
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
