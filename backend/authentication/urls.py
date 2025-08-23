from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . views import UserViewSet, CreateGroupViewSet, GroupViewSet

router = DefaultRouter()
router.register("users", UserViewSet, basename="user")
router.register("groups", CreateGroupViewSet, basename='group')
router.register("permissions", GroupViewSet, basename="permission")

app_name = "authentication"

urlpatterns = router.urls