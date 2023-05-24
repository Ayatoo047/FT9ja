import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'FTMAPP.settings')
celery = Celery('FTMAPP')
celery.config_from_object('django.conf:settings', namespace='CELERY')

celery.autodiscover_tasks()