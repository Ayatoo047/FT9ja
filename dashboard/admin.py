from django.contrib import admin
from . models import Statistic, Stock

# Register your models here.
admin.site.register(Stock)
admin.site.register(Statistic)
# admin.site.register(Profile)