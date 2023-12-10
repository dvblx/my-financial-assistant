# @app.task()
from django.contrib.auth.models import User
from django.core.cache import cache
from django.core.mail import EmailMessage

from bank_api_imitation.models import BankAccount
from celery_app import app


@app.task()
def send_code_to_email(user: User, email, bank_account: BankAccount):
    message = f'{user.firstname}, ваш код подтверждения для доступа к аккаунту банка {bank_account.bank.bank_name}:\n' \
              f' {bank_account.access_key}'
    email_message = EmailMessage(subject="Код подтверждения 'Мой финансовый помощник'", body=message, to=[email])
    email_message.send()
