# Generated by Django 4.1.5 on 2023-05-20 22:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='worker',
            name='shop',
        ),
        migrations.RemoveField(
            model_name='worker',
            name='user',
        ),
        migrations.DeleteModel(
            name='Shop',
        ),
        migrations.DeleteModel(
            name='Worker',
        ),
    ]
