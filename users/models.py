from django.db import models
from django.contrib.auth.models import User



class Otp(models.Model):
    profile = models.ForeignKey('Profile', null=True, blank=True, on_delete=models.CASCADE, related_name='otp')
    otp = models.CharField(max_length=6, null=True, blank=True)
    created = models.DateTimeField(auto_now=True, null=True)
    # duration = models.DurationField(default=datetime.timedelta(days =-1, seconds = 68400))

    def __str__(self):
        return str(self.otp)


class Profile(models.Model):
    user = models.OneToOneField(User, null=True, blank=True, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    email = models.EmailField(max_length=200)
    phone = models.CharField(max_length=11)
    # profile_image image = models.ImageField(null=True, blank=True)
    # dob = 
    address = models.CharField(max_length=500)
    country = models.CharField(max_length=300, null=True)
    zipcode = models.CharField(max_length=10, null=True)
    capital = models.IntegerField(null=True, blank=True)
    balance = models.DecimalField(null=True, blank=True, max_digits=12, decimal_places=2)
    # otp = models.CharField(max_length=6, null=True, blank=True)
    # otp = models.ForeignKey(Otp, on_delete=models.CASCADE, null=True, blank=True)
    # cart = models.OneToOneField(Cart, blank=True, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.user)

    # @property
    # def totalbalance(self):
    #     statistic = [x.result for x in self.statistic_set.all().all()]
    #     balance += sum(statistic)
    #     return balance