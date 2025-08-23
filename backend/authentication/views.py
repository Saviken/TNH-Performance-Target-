from .serializers import ( UserSerializer, GroupPermissionUpdateSerializer, GroupCreateSerializer )
from django.contrib.auth import get_user_model
User = get_user_model()
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from collections import defaultdict
from drf_spectacular.utils import extend_schema
from django.db.models import Prefetch


@extend_schema(tags=["Users"])
class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    serializer_class = UserSerializer
    pagination = None

    def get_queryset(self):
        # Exclude the anonymous user created by django-guardian
        qs = (User.objects.select_related("support_level").prefetch_related("groups").exclude(username="AnonymousUser").order_by("id"))
        return qs.exclude(username="AnonymousUser").order_by("id")
    
    def get_serializer_context(self):
        " Pass request to serializer context to access request.user "
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
    @action(detail=True, methods=["patch"], url_path="update-group")
    def update_group(self, request, pk=None):
        user = self.get_object()
        serializer = UserGroupUpdateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.update(user, serializer.validated_data)
            return Response({"detail": "Group updated successfully."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(tags=["Groups"])
class CreateGroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all().order_by("id") 
    serializer_class = GroupCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    def destroy(self, request, *args, **kwargs):
        group = self.get_object()
        if group.user_set.exists():
            return Response(
                {"detail": "Cannot delete a group that has users assigned."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().destroy(request, *args, **kwargs)

@extend_schema(tags=["Groups"])
class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all().order_by("id") 
    serializer_class = GroupPermissionUpdateSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=["post"], url_path="update-permissions")
    def update_permissions(self, request, pk=None):
        group = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.update(group, serializer.validated_data)
        return Response(
            {"detail": f"Permissions updated for group '{group.name}'."},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=["get"], url_path="available-permissions")
    def list_permissions(self, request):
        permissions = Permission.objects.select_related("content_type").all()
        grouped = defaultdict(list)

        for perm in permissions:
            key = f"{perm.content_type.app_label}.{perm.content_type.model}"
            grouped[key].append({
                "id": perm.id,
                "codename": perm.codename,
                "name": perm.name,
            })

        return Response(grouped, status=status.HTTP_200_OK)





