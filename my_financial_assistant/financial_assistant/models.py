from django.conf import settings
from django.db import models
from bank_api_imitation.models import BankAccount


# Личные данные пользователя
class UserEmailConfirm(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, verbose_name="Пользователь", on_delete=models.CASCADE)
    email_confirmed = models.BooleanField(verbose_name='Почта подтверждена', default=False)

    def __str__(self):
        return f'{self.user.username} - {self.email_confirmed}'


# Аккаунт с доступом к продуктам конкретного банка
class FinancialAssistantBankAccount(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name="Пользователь", on_delete=models.CASCADE)
    bank = models.ForeignKey(BankAccount, verbose_name="Банк", on_delete=models.CASCADE)
    access_confirmed = models.BooleanField(verbose_name='Доступ подтверждён', default=False)

    def __str__(self):
        return f'{self.user.username} - {self.bank.bank.bank_name}'


class BaseInvoice(models.Model):
    RUSSIAN_ROUBLE = "RUB"
    BELARUSIAN_ROUBLE = "BYN"
    TENGE = "KZT"
    DOLLAR = "USD"
    EURO = "EUR"
    YUAN = "CNY"
    LIRA = "TRY"
    DIRHAM = "DHS"
    POPULAR_CURRENCIES = [
        (RUSSIAN_ROUBLE, "Российский рубль"),
        (BELARUSIAN_ROUBLE, "Белорусский рубль"),
        (TENGE, "Тенге"),
        (DOLLAR, "Доллар"),
        (EURO, "Евро"),
        (YUAN, "Юань"),
        (LIRA, "Турецкая лира"),
        (DIRHAM, "Дирхам ОЭА")
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name="Пользователь", on_delete=models.CASCADE)
    currency = models.CharField(choices=POPULAR_CURRENCIES, max_length=3, verbose_name="Валюта")
    amount = models.PositiveIntegerField(verbose_name="Сумма", default=0)

    class Meta:
        abstract = True


# Финансовая цель (накопить на что-то, заработать n-ную сумму и тд)
class FinancialGoal(BaseInvoice):
    DAY = "DY"
    WEEK = "WK"
    MONTH = "MH"
    YEAR = "YR"
    PERIODS = [
        (DAY, "день"),
        (WEEK, "неделя"),
        (MONTH, "месяц"),
        (YEAR, "год")
    ]
    goal_name = models.CharField(max_length=80, default=None)
    put_aside_percent = models.PositiveIntegerField(verbose_name="Процент, который готов отложить")
    period_type = models.CharField(max_length=2)
    # Если нужно указать период 2 месяца, 10 дней и тп
    period_count = models.PositiveIntegerField()

    def __str__(self):
        return f'{self.user.username} - {self.goal_name}'


# Количество наличных, добавляется пользователем
class CashInvoice(BaseInvoice):

    def __str__(self):
        return f'{self.user.username} - {self.currency}'


class RegularSpending(BaseInvoice):
    DAY = "DY"
    WEEK = "WK"
    MONTH = "MH"
    YEAR = "YR"
    PERIODS = [
        (DAY, "день"),
        (WEEK, "неделя"),
        (MONTH, "месяц"),
        (YEAR, "год")
    ]
    spending_name = models.CharField(max_length=80, default=None)
    period = models.CharField(choices=PERIODS, max_length=2, verbose_name='Период траты')
    # Если нужно указать трату раз в 2 месяца, 10 дней и тп
    period_count = models.PositiveIntegerField()
    payment_url = models.CharField(max_length=100, null=True)

    def __str__(self):
        return f'{self.user.username} - {self.spending_name}'


