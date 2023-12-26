from django.contrib.auth.models import User
from rest_framework.fields import SerializerMethodField
from rest_framework.serializers import ModelSerializer

from bank_api_imitation.serializers import BankSerializer, BankAccountSerializer
from .models import *


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}


class UserEmailConfirmSerializer(ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = UserEmailConfirm
        fields = '__all__'


class FinancialAssistantBankAccountSerializer(ModelSerializer):
    user = UserSerializer()
    bank = BankAccountSerializer()

    class Meta:
        model = FinancialAssistantBankAccount
        fields = '__all__'


class FinancialAssistantBankAccountSerializerForList(ModelSerializer):
    bank = BankAccountSerializer()

    class Meta:
        model = FinancialAssistantBankAccount
        fields = '__all__'


class FinancialGoalSerializer(ModelSerializer):
    user = UserSerializer()
    current_progress = SerializerMethodField()

    class Meta:
        model = FinancialGoal
        fields = '__all__'

    def get_current_progress(self, obj):
        from my_financial_assistant.financial_assistant.logic.redis_functions import get_user_money
        return get_user_money(obj.user) * (obj.put_aside_percent/100)


class FinancialGoalSerializerCreateUpdate(ModelSerializer):

    class Meta:
        model = FinancialGoal
        fields = '__all__'


class CashInvoiceSerializer(ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = CashInvoice
        fields = '__all__'


class CashInvoiceSerializerCreateUpdate(ModelSerializer):

    class Meta:
        model = CashInvoice
        fields = '__all__'


class RegularSpendingSerializer(ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = RegularSpending
        fields = '__all__'


class RegularSpendingSerializerCreateUpdate(ModelSerializer):

    class Meta:
        model = RegularSpending
        fields = '__all__'
