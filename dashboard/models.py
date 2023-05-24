from django.db import models
from users.models import Profile

# Create your models here.


class Stock(models.Model):
    name = models.CharField(max_length=20)

    def __str__(self):
        return str(self.name)


class Statistic(models.Model):
    owner = models.ForeignKey(Profile, on_delete=models.CASCADE, null=True)
    result = models.IntegerField()
    stat_time = models.DateTimeField(auto_now_add=True, null=True)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, null=True, related_name='statistic')


    def __str__(self):
        return f'{self.owner} {self.result}'
