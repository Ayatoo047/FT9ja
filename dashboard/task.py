from FTMAPP.celery import celery
from pytz import timezone
from . models import Statistic
import datetime


@celery.task
def tradeIt(value, request):
    now = timezone('UTC').localize(datetime.datetime.now())
    #     created_time = otp.created + datetime.timedelta(hours = 1)
    #     if userotp == str(otp):
    #         if (now - created_time) >= datetime.timedelta(minutes = 1):

    if (now - Statistic.stat_time) >= datetime.timedelta(minutes = 1):
        Statistic.object.create(
            result = ((value /100) * request.user.balance),
            # stock = random(stock)
        )