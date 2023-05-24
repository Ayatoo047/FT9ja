from django.shortcuts import render
import random
from pytz import timezone
from .task import tradeIt
# Create your views here.



def tradeReturn():
    return random.randint(-100, 100)



def profitOrLoss(request):
    tradeIt(tradeReturn())
    user = request.user
