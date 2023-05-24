from django.urls import path
from .consumers import DashboardConsumer

websocket_urlpatterns = [
    path('ws/<str:owner>/', DashboardConsumer.as_asgi())
]