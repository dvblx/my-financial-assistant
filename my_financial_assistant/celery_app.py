from os import environ

from celery import Celery
from django.conf import settings

environ.setdefault('DJANGO_SETTINGS_MODULE', 'my_financial_assistant.settings')

app = Celery('service')
app.config_from_object('django.conf:settings')
app.conf.broker_url = settings.CELERY_BROKER_URL
app.autodiscover_tasks()
