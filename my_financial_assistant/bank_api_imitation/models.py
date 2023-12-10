from uuid import uuid4
from django.conf import settings
from django.db import models


# Банк
class Bank(models.Model):
    bank_name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.bank_name


# Клиент банка
class BankAccount(models.Model):
    bank = models.ForeignKey(Bank, on_delete=models.CASCADE)
    phone = models.CharField(max_length=12)
    email = models.EmailField()
    password = models.CharField(max_length=100)
    access_key = models.UUIDField(blank=True)

    def save(self, *args, **kwargs):
        self.access_key = uuid4()
        super(BankAccount, self).save(*args, **kwargs)

    def __str__(self):
        return f'{self.email} - {self.bank.bank_name}'


# Продукт банка
class BankProduct(models.Model):
    BANK_DEPOSITS = "BD"
    CREDITS = "CR"
    BANK_CARDS = "BC"
    MORTGAGES = "MO"
    BUSINESS_ACCOUNT = "BA"
    INSURANCE = "IN"
    INVESTMENTS = "IV"

    PRODUCTS = [
        (BANK_DEPOSITS, "Вклады"),
        (BANK_CARDS, "Карты/счета"),
        (BUSINESS_ACCOUNT, "Для бизнеса"),
        (INVESTMENTS, "Инвестиции"),
    ]
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
        (DOLLAR, "Доллар"),
        (EURO, "Евро"),
        (YUAN, "Юань"),
        (LIRA, "Турецкая лира"),
        (DIRHAM, "Дирхам ОЭА")
    ]

    currency = models.CharField(choices=POPULAR_CURRENCIES, max_length=3, verbose_name="Валюта")
    amount = models.PositiveIntegerField(verbose_name="Сумма", default=0)
    bank_account = models.ForeignKey(BankAccount, on_delete=models.CASCADE)
    balance = models.PositiveIntegerField(verbose_name="Баланс", default=0)
    product_type = models.CharField(choices=PRODUCTS, max_length=3, verbose_name='Тип банковского продукта')

    def __str__(self):
        return f'{self.bank_account} - {self.product_type}'


# Родительский абстрактный класс для трат и поступлений. Таблица в бд для него не создаётся
class Operation(models.Model):
    STORE_PURCHASE = "SP"
    TRANSPORT_PAYMENT = "TP"
    TELECOM_AND_INTERNET_CHARGES = "TI"
    CAFES_AND_RESTAURANTS = "CR"
    CARD_TRANSFERS = "CT"
    ENTERTAINMENTS = "EN"
    BEAUTY_AND_HEALTH = "BH"
    CLOTHES_AND_SHOES = "CS"
    HOUSEHOLD_GOODS = "HG"
    FUEL = "FU"
    CASHBACK = "CB"
    SALARY = "SA"
    SOCIAL_PAYMENT = "SP"
    SCHOLARSHIP = "SC"
    OTHER = "OT"
    OPERATIONS = [
        (STORE_PURCHASE, "Покупки в магазинах"),
        (TRANSPORT_PAYMENT, "Проезд в общественном транспорте"),
        (TELECOM_AND_INTERNET_CHARGES, "Связь и интернет"),
        (CAFES_AND_RESTAURANTS, "Рестораны и кафе"),
        (CARD_TRANSFERS, "Переводы"),
        (ENTERTAINMENTS, "Развлечения"),
        (FUEL, "Топливо"),
        (CASHBACK, "Кэшбэк"),
        (SALARY, "Зарплата"),
        (SCHOLARSHIP, "Стипендия"),
        (SOCIAL_PAYMENT, "Социальные выплаты"),
        (OTHER, "Другие траты"),
    ]

    sender = models.ForeignKey(BankProduct, on_delete=models.CASCADE, verbose_name='Отправитель',
                               related_name="recipients")
    recipient = models.ForeignKey(BankProduct, on_delete=models.CASCADE, verbose_name='Получатель',
                                  related_name="senders")
    amount = models.PositiveIntegerField(verbose_name='Сумма')
    operation_date_time = models.DateTimeField()
    type_of_spend = models.CharField(choices=OPERATIONS, max_length=2, verbose_name='Тип операции')

    def __str__(self):
        return f'from {self.sender} to {self.recipient}: {self.operation_date_time}'
