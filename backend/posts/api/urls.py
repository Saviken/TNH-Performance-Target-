
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, BranchViewSet, SubtitleViewSet, PerformanceObjectiveViewSet, QuarterlyProgressViewSet, NotificationViewSet
from .views_user import UserViewSet


post_router = DefaultRouter()
post_router.register(r'posts', PostViewSet)
post_router.register(r'notifications', NotificationViewSet)
post_router.register(r'branches', BranchViewSet)
post_router.register(r'subtitles', SubtitleViewSet)
post_router.register(r'objectives', PerformanceObjectiveViewSet)
post_router.register(r'quarters', QuarterlyProgressViewSet)
post_router.register(r'users', UserViewSet)

urlpatterns = post_router.urls

