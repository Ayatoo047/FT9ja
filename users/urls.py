from django.urls import path
from .views import loginUser, registerUser, verifyOtp, logoutuser, dashboard, chart_data, allTrader, user_data

urlpatterns = [
    path('', loginUser, name='login'),
    path('logout/', logoutuser, name='logout'),
    path('register/', registerUser, name='register'),
    path('alltrader/', allTrader, name='alltrader'),
    path('otpverification', verifyOtp, name='otpverification'),
    path('dashboard/<user>', dashboard, name='dashboard'),
    path('dashboard/<user>/chart/', chart_data, name='chart'),
    path('user_data/<str:pk>', user_data, name='userdata'),
]