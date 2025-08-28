from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Dimension, StrategicObjective, Initiative, InitiativeAction, ApprovalStatus, ApprovalEntry
from .serializers import (
    DimensionSerializer, StrategicObjectiveSerializer, InitiativeActionSerializer, InitiativeSerializer,
    ApprovalStatusSerializer, RejectApprovalRequestSerializer, ApproveApprovalRequestSerializer, 
    RequestApprovalSerializer, CancelApprovalRequestSerializer
)

class DimensionViewSet(viewsets.ModelViewSet):
    queryset = Dimension.objects.select_related("created_by", "modified_by")
    serializer_class = DimensionSerializer

    def get_serializer_context(self):
        " Pass request to serializer context to access request.user "
        context = super().get_serializer_context()
        context["request"] = self.request
        return context 
    
class StrategicObjectiveViewSet(viewsets.ModelViewSet):
    queryset = StrategicObjective.objects.select_related("created_by", "modified_by")
    serializer_class = StrategicObjectiveSerializer

    def get_serializer_context(self):
        " Pass request to serializer context to access request.user "
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
    
class InitiativeViewSet(viewsets.ModelViewSet):
    serializer_class = InitiativeSerializer

    def get_serializer_context(self):
        " Pass request to serializer context to access request.user "
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
    
    def get_queryset(self):
        user = self.request.user
        qs = Initiative.objects.select_related("status", "objective", "dimension", "created_by", "modified_by")
        if user.is_superuser or user.role == "SYSTEM_ADMIN":
            return qs

        if not user.dimension:
            return Initiative.objects.none()

        return qs.filter(dimension=user.dimension)
    
class InitiativeActionViewSet(viewsets.ModelViewSet):
    serializer_class = InitiativeActionSerializer

    def get_serializer_context(self):
        " Pass request to serializer context to access request.user "
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
    
    def get_queryset(self):
        user = self.request.user
        qs = InitiativeAction.objects.select_related("initiative", "created_by", "modified_by")
        if user.is_superuser or user.role == "SYSTEM_ADMIN":
            return qs

        if not user.dimension:
            return InitiativeAction.objects.none()

        return qs.filter(initiative__dimension=user.dimension)

class ApprovalStatusViewSet(viewsets.ModelViewSet):
    queryset = ApprovalStatus.objects.select_related("created_by", "modified_by")
    serializer_class = ApprovalStatusSerializer

    def get_serializer_context(self):
        " Pass request to serializer context to access request.user "
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
    
class RequestApprovalViewSet(viewsets.ModelViewSet):
    queryset = ApprovalEntry.objects.select_related("status", "requestor", "approver")
    serializer_class = RequestApprovalSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

class ApproveApprovalRequestViewSet(viewsets.ModelViewSet):
    queryset = ApprovalEntry.objects.select_related("status", "requestor", "approver")
    serializer_class = ApproveApprovalRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
    
class RejectApprovalRequestViewSet(viewsets.ModelViewSet):
    queryset = ApprovalEntry.objects.select_related("status", "requestor", "approver")
    serializer_class = RejectApprovalRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
    
class CancelApprovalRequestViewSet(viewsets.ModelViewSet):
    queryset = ApprovalEntry.objects.select_related("status", "requestor", "approver")
    serializer_class = CancelApprovalRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context