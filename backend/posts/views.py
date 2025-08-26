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
    queryset = StrategicObjective.objects.select_related("dimension", "created_by", "modified_by")
    serializer_class = StrategicObjectiveSerializer

    def get_serializer_context(self):
        " Pass request to serializer context to access request.user "
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
    
class InitiativeViewSet(viewsets.ModelViewSet):
    queryset = Initiative.objects.select_related("status", "objective", "created_by", "modified_by")
    serializer_class = InitiativeSerializer

    def get_serializer_context(self):
        " Pass request to serializer context to access request.user "
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
    
class InitiativeActionViewSet(viewsets.ModelViewSet):
    queryset = InitiativeAction.objects.select_related("initiative")
    serializer_class = InitiativeActionSerializer

    def get_serializer_context(self):
        " Pass request to serializer context to access request.user "
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

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