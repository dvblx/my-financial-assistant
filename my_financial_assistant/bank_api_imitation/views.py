from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework.mixins import RetrieveModelMixin, ListModelMixin, CreateModelMixin
from rest_framework.viewsets import GenericViewSet

from .permissions import sender_permission, recipient_permission
from .serializers import *
from rest_framework.response import Response


class SpendsViewSet(RetrieveModelMixin, ListModelMixin, CreateModelMixin, GenericViewSet):
    serializer_class = OperationSerializer

    @action(methods=['get'], detail=False)
    def get_spends_filter_by_bank_account(self, request, account_id):
        account = get_object_or_404(BankAccount, pk=account_id)
        sender_permission(request, account_id)

    @action(methods=['get'], detail=False)
    def get_spends_filter_by_bank_product(self, request, product_id):
        product = get_object_or_404(BankProduct, pk=product_id)
        sender_permission(request, product.bank_account.id)
        pass

    @action(methods=['get'], detail=False)
    def get_spends_filter_by_bank_account_and_period(self, request, account_id, date_from, date_to):
        account = get_object_or_404(BankAccount, pk=account_id)
        sender_permission(request, account_id)

    @action(methods=['get'], detail=False)
    def get_spends_filter_by_bank_product_and_period(self, request, product_id, date_from, date_to):
        product = get_object_or_404(BankProduct, pk=product_id)
        sender_permission(request, product.bank_account.id)


class ReceiptsViewSet(RetrieveModelMixin, ListModelMixin, CreateModelMixin, GenericViewSet):
    serializer_class = OperationSerializer

    @action(methods=['get'], detail=False)
    def get_receipts_filter_by_bank_account(self, request, account_id):
        account = get_object_or_404(BankAccount, pk=account_id)
        recipient_permission(request, account_id)
        products = BankProduct.objects.filter(bank_account=account)
        result = [Operation.objects.filter(recipient=product) for product in products]
        serializer = OperationSerializer(result)
        return Response(serializer.data)

    @action(methods=['get'], detail=False)
    def get_receipts_filter_by_bank_product(self, request, product_id):
        product = get_object_or_404(BankProduct, pk=product_id)
        recipient_permission(request, product.bank_account.id)
        serializer = OperationSerializer(Operation.objects.filter(recipient=product))
        return Response(serializer.data)

    @action(methods=['get'], detail=False)
    def get_receipts_filter_by_bank_account_and_period(self, request, account_id, date_from, date_to):
        account = get_object_or_404(BankAccount, pk=account_id)
        recipient_permission(request, account_id)
        products = BankProduct.objects.filter(bank_account=account)
        result = [Operation.objects.filter(recipient=product) for product in products]
        serializer = OperationSerializer(result)
        return Response(serializer.data)

    @action(methods=['get'], detail=False)
    def get_receipts_filter_by_bank_product_and_period(self, request, product_id, date_from, date_to):
        product = get_object_or_404(BankProduct, pk=product_id)
        recipient_permission(request, product.bank_account.id)
        serializer = OperationSerializer(Operation.objects.filter(recipient=product))
        return Response(serializer.data)
