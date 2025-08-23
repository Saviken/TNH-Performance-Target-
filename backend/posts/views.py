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
    queryset = Dimension.objects.all()
    serializer_class = DimensionSerializer

    def get_serializer_context(self):
        " Pass request to serializer context to access request.user "
        context = super().get_serializer_context()
        context["request"] = self.request
        return context 
    
class StrategicObjectiveViewSet(viewsets.ModelViewSet):
    queryset = StrategicObjective.objects.all()
    serializer_class = StrategicObjectiveSerializer

    def get_serializer_context(self):
        " Pass request to serializer context to access request.user "
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
    
class InitiativeViewSet(viewsets.ModelViewSet):
    queryset = Initiative.objects.all()
    serializer_class = InitiativeSerializer

    def get_serializer_context(self):
        " Pass request to serializer context to access request.user "
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
    
class InitiativeActionViewSet(viewsets.ModelViewSet):
    queryset = InitiativeAction.objects.all()
    serializer_class = InitiativeActionSerializer

    def get_serializer_context(self):
        " Pass request to serializer context to access request.user "
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

class ApprovalStatusViewSet(viewsets.ModelViewSet):
    queryset = ApprovalStatus.objects.all()
    serializer_class = ApprovalStatusSerializer

    def get_serializer_context(self):
        " Pass request to serializer context to access request.user "
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
    
class RequestApprovalViewSet(viewsets.ModelViewSet):
    queryset = ApprovalEntry.objects.all()
    serializer_class = RequestApprovalSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

class ApproveApprovalRequestViewSet(viewsets.ModelViewSet):
    queryset = ApprovalEntry.objects.all()
    serializer_class = ApproveApprovalRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
    
class RejectApprovalRequestViewSet(viewsets.ModelViewSet):
    queryset = ApprovalEntry.objects.all()
    serializer_class = RejectApprovalRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
    
class CancelApprovalRequestViewSet(viewsets.ModelViewSet):
    queryset = ApprovalEntry.objects.all()
    serializer_class = CancelApprovalRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context