# Generated by Django 4.0.4 on 2023-12-09 23:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('financial_assistant', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='regularspending',
            name='spending_name',
            field=models.CharField(default=None, max_length=80),
        ),
        migrations.AlterField(
            model_name='financialgoal',
            name='goal_name',
            field=models.CharField(default=None, max_length=80),
        ),
    ]