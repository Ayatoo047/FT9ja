from django.contrib import admin
from .models import *


class OtpAdmin(admin.ModelAdmin):
    readonly_fields = ['created', 'profile']
    fields = ['profile','otp', 'created']

# class ShopAdmin(admin.ModelAdmin):
#     # readonly_fields = ['user', 'workers']
#     fields = '__all__'
# Register your models here.
admin.site.register(Profile)
admin.site.register(Otp, OtpAdmin)

