# Generated by Django 4.1.5 on 2023-05-21 10:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0002_statistic_owner'),
    ]

    operations = [
        migrations.AlterField(
            model_name='statistic',
            name='result',
            field=models.IntegerField(),
        ),
    ]
