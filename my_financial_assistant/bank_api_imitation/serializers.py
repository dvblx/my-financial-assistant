from rest_framework import serializers

from .models import *


class BankSerializer(serializers.ModelSerializer):

    class Meta:
        model = Bank
        fields = '__all__'


class BankAccountSerializer(serializers.ModelSerializer):
    bank = BankSerializer()

    class Meta:
        model = BankAccount
        fields = '__all__'


class BankProductSerializer(serializers.ModelSerializer):
    bank_account = BankAccountSerializer()

    class Meta:
        model = BankProduct
        fields = '__all__'


class OperationSerializer(serializers.ModelSerializer):
    spender = BankProductSerializer()
    recipient = BankProductSerializer()

    class Meta:
        model = Operation
        fields = '__all__'
