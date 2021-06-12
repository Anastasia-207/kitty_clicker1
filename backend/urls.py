from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.UserList.as_view()),
    path('users/<int:pk>/', views.UserDetail.as_view()),
    path('cycles/', views.CycleList.as_view()),
    path('cycles/<int:pk>/', views.CycleDetail.as_view()),
    path('buy_boost/', views.buy_boost),
    path('boosts/<int:main_cycle>/', views.BoostList.as_view()),
    path('save_main_cycle/', views.save_main_cycle),
]
