from django.contrib.auth.models import User
from django.core.cache import cache

from bank_api_imitation.models import BankProduct
from financial_assistant.models import FinancialAssistantBankAccount, FinancialGoal, CashInvoice, \
    RegularSpending

CACHE_TIME = 300


def get_main_page_content(current_user: User):
    current_user_bank_accounts = FinancialAssistantBankAccount.objects.filter(user=current_user)
    current_user_bank_products = []
    for bank_account in current_user_bank_accounts:
        bank_products_count_from_cache = cache.get(f'user_{current_user.pk}_bank_{bank_account.pk}_products')
        current_user_bank_products.append(
            bank_products_count_from_cache if bank_products_count_from_cache else BankProduct.objects.filter(
                bank_account=bank_account).count())
    current_user_bank_products = sum(current_user_bank_products)
    current_user_financial_goals = cache.get(f'{current_user.pk}_financial_goals')
    if not current_user_financial_goals:
        current_user_financial_goals = FinancialGoal.objects.filter(user=current_user).count()
        cache_data(f'{current_user.pk}_financial_goals', current_user_financial_goals, CACHE_TIME)
    current_user_cash_invoices = cache.get(f'{current_user.pk}_cash_invoices')
    if not current_user_cash_invoices:
        current_user_cash_invoices = CashInvoice.objects.filter(user=current_user).count()
        cache_data(f'{current_user.pk}_cash_invoices', current_user_cash_invoices, CACHE_TIME)
    current_user_regular_spends = cache.get(f'{current_user.pk}_cash_invoices')
    if not current_user_regular_spends:
        current_user_regular_spends = RegularSpending.objects.filter(user=current_user).count()
        cache_data(f'{current_user.pk}_cash_invoices', current_user_regular_spends, CACHE_TIME)
    response = {
        'current_user_bank_products': current_user_bank_products,
        'current_user_financial_goals': current_user_financial_goals,
        'current_user_cash_invoices': current_user_cash_invoices,
        'current_user_regular_spends': current_user_regular_spends
    }
    return response


def cache_data(key, value, time):
    cache.set(key, value, time)


def remove_data_from_cache(key):
    cache.delete(key)


def get_user_money(user):
    money = cache.get(f'{user.pk}_money')
    if money:
        return money
    money = 0
    user_bank_accounts = [account.bank for account in
                          FinancialAssistantBankAccount.objects.filter(user=user)]
    user_bank_products = BankProduct.objects.filter(bank_account__in=user_bank_accounts)
    for product in user_bank_products:
        money += product.amount
    cache_data(f'{user.pk}_money', money, CACHE_TIME)
    return money
