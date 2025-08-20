from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db import models
from django.contrib.auth import get_user_model
from ..models import Post, Subtitle, PerformanceObjective, QuarterlyProgress
from posts.models import Notification
from .serializers import NotificationSerializer, PostSerializer, BranchSerializer, SubtitleSerializer, PerformanceObjectiveSerializer, QuarterlyProgressSerializer
from posts.models_department import Branch
from django.conf import settings
from django.http import HttpResponse
import io

# Helper function to map branch names to frontend routes
def get_department_route(branch_name):
    """Map branch names to frontend routes"""
    if not branch_name:
        return "/dashboard"
    
    route_mapping = {
        'Finance': '/pages/finance',
        'Medical Services': '/pages/medical-services',
        'Strategy Innovation': '/pages/strategy-innovation',
        'ICT': '/pages/ict',
        'Nursing Services': '/pages/nursing-services',
        'Supply Chain': '/pages/supply-chain',
        'Operation': '/pages/operation',
        'Operations': '/pages/operation',
        'Legal KHA': '/pages/legal-kha',
        'Security': '/pages/security',
        'Internal Audit': '/pages/internal-audit',
        'Risk Compliance': '/pages/risk-compliance',
        'Engineering': '/pages/engineering',
        'Health Science': '/pages/health-science',
        'Human Resource': '/pages/human-resource',
        'Human Resources': '/pages/human-resource',
    }
    
    return route_mapping.get(branch_name, '/dashboard')

# Notification API
class NotificationViewSet(ModelViewSet):
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer
    # Temporarily remove authentication for testing
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # For now, return all notifications since we don't have user auth
        return Notification.objects.all().order_by('-created_at')

class SubtitleViewSet(ModelViewSet):
    queryset = Subtitle.objects.all()
    serializer_class = SubtitleSerializer

class PostViewSet(ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    @action(detail=True, methods=['post'], url_path='approve')
    def approve(self, request, pk=None):
        post = self.get_object()
        post.status = 'APPROVED'
        post.is_locked = False
        post.save()

        # Create notification for approval
        User = get_user_model()
        department_url = get_department_route(post.branch.name if post.branch else None)
        for admin_user in User.objects.filter(is_staff=True):
            Notification.objects.create(
                recipient=admin_user,
                message=f"Post was approved by admin.",
                url=department_url
            )

        return Response({'message': 'Post approved successfully', 'status': post.status})

    @action(detail=True, methods=['post'], url_path='reject')
    def reject(self, request, pk=None):
        post = self.get_object()
        comment = request.data.get('comment', '')
        post.status = 'REJECTED'
        post.rejection_comment = comment
        post.is_locked = True
        post.save()

        # Create notification for rejection
        User = get_user_model()
        department_url = get_department_route(post.branch.name if post.branch else None)
        for admin_user in User.objects.filter(is_staff=True):
            Notification.objects.create(
                recipient=admin_user,
                message=f"Post was rejected by admin. Reason: {comment or 'No reason provided'}",
                url=department_url
            )

        return Response({'message': 'Post rejected successfully', 'status': post.status})

class BranchViewSet(ModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer

class PerformanceObjectiveViewSet(ModelViewSet):
    queryset = PerformanceObjective.objects.all()
    serializer_class = PerformanceObjectiveSerializer

    @action(detail=True, methods=['post'], url_path='approve')
    def approve(self, request, pk=None):
        obj = self.get_object()
        obj.status = 'APPROVED'
        obj.is_locked = False
        obj.save()

        # Create notification for approval
        User = get_user_model()
        department_url = get_department_route(obj.branch.name if obj.branch else None)
        for admin_user in User.objects.filter(is_staff=True):
            Notification.objects.create(
                recipient=admin_user,
                message=f"Performance objective '{obj.subtitle.name} - {obj.criteria.name if obj.criteria else 'General'}' was approved.",
                url=department_url
            )

        return Response(self.get_serializer(obj).data)

    @action(detail=True, methods=['post'], url_path='reject')
    def reject(self, request, pk=None):
        obj = self.get_object()
        comment = request.data.get('comment', '')
        obj.status = 'REJECTED'
        obj.rejection_comment = comment
        obj.is_locked = True
        obj.save()

        # Create notification for rejection
        User = get_user_model()
        department_url = get_department_route(obj.branch.name if obj.branch else None)
        for admin_user in User.objects.filter(is_staff=True):
            Notification.objects.create(
                recipient=admin_user,
                message=f"Performance objective '{obj.subtitle.name} - {obj.criteria.name if obj.criteria else 'General'}' was rejected. Reason: {comment or 'No reason provided'}",
                url=department_url
            )

        return Response(self.get_serializer(obj).data)

class QuarterlyProgressViewSet(ModelViewSet):
    queryset = QuarterlyProgress.objects.all()
    serializer_class = QuarterlyProgressSerializer

    @action(detail=True, methods=['post'], url_path='approve')
    def approve(self, request, pk=None):
        qp = self.get_object()
        qp.status = 'APPROVED'
        qp.is_locked = False
        qp.save()

        # Create notification for approval
        User = get_user_model()
        department_url = get_department_route(qp.objective.branch.name if qp.objective.branch else None)
        for admin_user in User.objects.filter(is_staff=True):
            Notification.objects.create(
                recipient=admin_user,
                message=f"Quarter {qp.quarter} {qp.year} progress for '{qp.objective.subtitle.name} - {qp.objective.criteria.name if qp.objective.criteria else 'General'}' was approved.",
                url=department_url
            )

        return Response(self.get_serializer(qp).data)

    @action(detail=True, methods=['post'], url_path='reject')
    def reject(self, request, pk=None):
        qp = self.get_object()
        comment = request.data.get('comment', '')
        qp.status = 'REJECTED'
        qp.rejection_comment = comment
        qp.is_locked = True
        qp.save()

        # Create notification for rejection
        User = get_user_model()
        department_url = get_department_route(qp.objective.branch.name if qp.objective.branch else None)
        for admin_user in User.objects.filter(is_staff=True):
            Notification.objects.create(
                recipient=admin_user,
                message=f"Quarter {qp.quarter} {qp.year} progress for '{qp.objective.subtitle.name} - {qp.objective.criteria.name if qp.objective.criteria else 'General'}' was rejected.",
                url=department_url
            )

        return Response(self.get_serializer(qp).data)
