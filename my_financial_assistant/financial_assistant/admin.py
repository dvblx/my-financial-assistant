from django.contrib import admin

from financial_assistant.models import *

admin.site.register(UserEmailConfirm)
admin.site.register(FinancialAssistantBankAccount)
admin.site.register(CashInvoice)
admin.site.register(RegularSpending)
