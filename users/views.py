from django.template.loader import get_template
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.shortcuts import render, redirect, get_list_or_404, get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.db.models import Sum
from django.http import HttpResponse, JsonResponse
import random
from .models import *
from django.conf import settings
from pytz import timezone
import datetime
from dashboard.models import Statistic, Stock
from django.db.models import Count, Func, F, Sum

# Create your views here.
def add_first_elements(tuples_list):
    sums = {}
    for tup in tuples_list:
        if tup[1] in sums:
            sums[tup[1]] += tup[0]
        else:
            sums[tup[1]] = tup[0]
    return sums

def dashboard(request, user):
    user = request.user.id
    profile = Profile.objects.filter(user__id = user).first()
    statistic = Statistic.objects.filter(owner = profile).all()
    statisticg = Statistic.objects.filter(owner = profile)
    profit = sum([x.result for x in statistic if x.result > 0])
    loss = sum([x.result for x in statistic if x.result < 0])
    stat_data = [x for x in statistic][-10:]

    rr= Statistic.objects.filter(owner = profile).annotate(orders=Sum('stock'))
    y = [(x.result,x.stock) for x in rr]
    result =add_first_elements(y)
    # print(result)
    context = {'result': result,'profile':profile, 'statistic':statistic, 'stat_data': stat_data, 'profit': profit, 'loss': loss}
    # print(Stock.objects.filter(statistic__owner = profile).filter(pk=F('statistic__stock__id')).annotate(orders=Sum('statistic__result')))
    # Statistic.objects.filter(owner = profile).annotate(
    #     result = Sum('result')
    # )
    # print(stock.statistic.result)
    # return render(request, 'users/dashboard.html', context) #'users/index.html'
    return render(request, 'index.html', context) #'users/index.html'


# def traders(request):
#     statistic = Statistic.objects.all()
#     context = {'statistic': statistic}
#     return render(request, 'trader.html', context)

def allTrader(request):
    profiles = Profile.objects.all()
    statistic = Statistic.objects.distinct().all()
    context = {'statistic': statistic, 'profiles': profiles}

    # if request.method == 'POST':
    #     return redirect('chart:dashboard', )
    return render(request, 'users/listuser.html', context)



def user_data(request, pk):
    profile = Profile.objects.get(user=pk)
    statistic = Statistic.objects.filter(owner = profile).all()
    statistic = Statistic.objects.filter(owner = profile).all()
    statisticg = Statistic.objects.filter(owner = profile)
    profit = sum([x.result for x in statistic if x.result > 0])
    loss = sum([x.result for x in statistic if x.result < 0])
    stat_data = [x for x in statistic][-10:]

    rr= Statistic.objects.filter(owner = profile).annotate(orders=Sum('stock'))
    y = [(x.result,x.stock) for x in rr]
    result =add_first_elements(y)
    # print(result)
    # print(chart_data(request, profile.user))
    context = {'result': result,'profile':profile, 'statistic':statistic, 'stat_data': stat_data, 'profit': profit, 'loss': loss}
    return render(request, 'users/dashboard.html', context)
#     user = request.user
#     if request.user.is_staff:
#     profile = Profile.objects.filter(user__username=user)
#     else:
#         profile = Profile.objects.filter(user=request.user)
#     profile = request.user.profile
#     statistic = Statistic.objects.filter(owner = profile).all()
#     chart_data = [x.result for x in statistic]
#     chart_label = f'{request.user} trade session'

#     print(profile.user)

#     rr= Statistic.objects.filter(owner = profile).annotate(orders=Sum('stock'))
#     y = [(x.result,x.stock) for x in rr]
#     result =add_first_elements(y)
#     chart_data2 = [value for key, value in result.items()]
#     chart_label2 = [key for key, value in result.items()]

#     return JsonResponse({
#         'chartData': chart_data,
#         'chartLabel': chart_label,
#         'chartData2':chart_data2,
#         'chartLabel2':chart_label2,
#     })


def chart_data(request, user):
    # user = request.user
    if request.user.is_staff:
        profile = Profile.objects.filter(user__username=user).first()
    else:
        profile = Profile.objects.get(user=request.user)
    # profile = request.user.profile
    statistic = Statistic.objects.filter(owner = profile).all()
    chart_data = [x.result for x in statistic]
    chart_label = [str(x.stat_time.strftime("%H:%M:%S")) for x in statistic]

    # print(profile.user)

    rr= Statistic.objects.filter(owner = profile).annotate(orders=Sum('stock'))
    y = [(x.result,x.stock) for x in rr]
    result =add_first_elements(y)
    chart_data2 = [value for key, value in result.items()]
    chart_label2 = [key for key, value in result.items()]

    return JsonResponse({
        'chartData': chart_data,
        'chartLabel': chart_label,
        # 'chartData2':chart_data2,
        # 'chartLabel2':chart_label2,
    })

def generateOtp():
    genotp = [random.randint(0,9) for number in range(6)]
    otp = ("".join([str(i) for i in genotp]))
    return(otp)


def loginUser(request):

    page = 'login'
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        try:
            user = User.object.get(username=username)

        except:
            HttpResponse('user doesnt exist')

        user = authenticate(username = username, password=password)

        if user is not None:
            login(request, user)
            return redirect('dashboard', user=user)
        else:
            print('something went wrong')

    context = {'page': page}
    return render(request, 'auth-login-basic.html', context)




def registerUser(request):
    user = None

    if request.method == "POST":
        otp=generateOtp()
        username = request.POST['username'].lower()
        password = request.POST['password']
        email = request.POST['email']
        # confirmpassword = request.POST['confirmpassword']
        
        # if password != confirmpassword:
        #     print('password doesnt match')

        user = User.objects.create_user(
            username = username,
            password = password,
            email=email,
            # password2 = confirmpassword,
        )
        # user.is_active = False
        login(request, user)

        profile = Profile.objects.create(
            user = request.user,
            balance = 1000,
        )
        # Otp.objects.create(
        #     otp = otp,
        #     profile = profile
        # )
        # sendEmail(request, otp=otp)
        return redirect('dashboard', user=user)

    
    return render(request, 'auth-login-basic.html')

def sendEmail(request, otp):
    mail_subject = 'Trascation File'
    message = render_to_string('otpemail.html', {
        'otp': otp,
    })
    to_email = [request.user.email]
    context_dict = {
        'user': request.user.profile.first_name,
        'otp': otp,
        'to_email' : to_email
    }
    template = get_template('otpemail.html')
    message  = template.render(context_dict)
    
    
    email = EmailMultiAlternatives(
        subject=mail_subject,
        body='This is your document',
        from_email =settings.EMAIL_HOST_USER,
        to = [to_email]
    )
    email.attach_alternative(message, "text/html")
 
    email.send(fail_silently=True)
    render(request,template_name='users/otp-verification.html')
    print('success', otp)

def verifyOtp(request):
    profile = request.user.profile
    otp = Otp.objects.filter(profile__id=profile.id).first()
    if request.method == 'POST':
        userotp = request.POST['inputotp']

        now = timezone('UTC').localize(datetime.datetime.now())
        created_time = otp.created + datetime.timedelta(hours = 1)
        if userotp == str(otp):
            if (now - created_time) >= datetime.timedelta(minutes = 1):
                print('otp expired, new sent')
                otp.otp = generateOtp()
                otp.save()
                newotp = otp.otp
                sendEmail(request, otp=str(newotp))
                return redirect('otpverification')


            elif (now - created_time) < datetime.timedelta(minutes = 1):
                otp.otp = '-'
                otp.save()

                return redirect('index')

    context = {'profile': profile, 'otp':otp}
    return render(request, 'users/otp-verification.html', context)



def logoutuser(request):
    logout(request)
    return redirect('login')
