from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.test_endpoint, name='test-endpoint'),
    path('users/', views.users_list, name='users-list'),
    path('current/', views.current_user, name='current-user'),
]
