from django.contrib import admin

from bank_api_imitation.models import *

admin.site.register(Bank)
admin.site.register(BankAccount)
admin.site.register(BankProduct)
admin.site.register(Operation)
