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

    def list(self, request, *args, **kwargs):
        """Optionally filter by ?branch=slug (case-insensitive, hyphens -> spaces).
        If ?grouped=true return grouped structure used by legacy frontend.
        """
        qs = self.get_queryset().select_related('branch', 'subtitle', 'criteria')
        branch_slug = request.query_params.get('branch')
        if branch_slug:
            branch_name = branch_slug.replace('-', ' ')
            qs = qs.filter(branch__name__iexact=branch_name)
        grouped_flag = request.query_params.get('grouped') in ['1', 'true', 'True']
        if not grouped_flag:
            serializer = self.get_serializer(qs, many=True)
            return Response(serializer.data)
        # Build grouped { subtitle: { criteria: [objs] } }
        data = {}
        serializer = self.get_serializer(qs, many=True).data
        for obj in serializer:
            subtitle = obj['subtitle'] or 'Unspecified Subtitle'
            criteria = obj['criteria'] or 'Unspecified Criteria'
            data.setdefault(subtitle, {}).setdefault(criteria, []).append(obj)
        return Response({'data': data})

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
        # Make editable after rejection
        obj.is_locked = False
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

    @action(detail=True, methods=['post'], url_path='submit')
    def submit(self, request, pk=None):
        """Submit a draft/rejected objective for approval (-> PENDING)."""
        obj = self.get_object()
        if obj.status in ['DRAFT', 'REJECTED']:
            obj.status = 'PENDING'
            obj.is_locked = True  # lock baseline while pending
            obj.save()
            # Notify admins
            User = get_user_model()
            department_url = get_department_route(obj.branch.name if obj.branch else None)
            for admin_user in User.objects.filter(is_staff=True):
                Notification.objects.create(
                    recipient=admin_user,
                    message=f"Performance objective '{obj.subtitle.name} - {obj.criteria.name if obj.criteria else 'General'}' submitted for approval.",
                    url=department_url
                )
        return Response(self.get_serializer(obj).data)

    @action(detail=True, methods=['post'], url_path='unlock')
    def unlock(self, request, pk=None):
        """Admin unlocks objective back to DRAFT for editing."""
        obj = self.get_object()
        obj.status = 'DRAFT'
        obj.is_locked = False
        obj.save()
        return Response(self.get_serializer(obj).data)

    @action(detail=True, methods=['post'], url_path='withdraw')
    def withdraw(self, request, pk=None):
        """User withdraws a pending submission back to draft."""
        obj = self.get_object()
        if obj.status == 'PENDING':
            obj.status = 'DRAFT'
            obj.is_locked = False
            obj.save()
        return Response(self.get_serializer(obj).data)

    # Unit of Measure Workflow Actions
    @action(detail=True, methods=['post'], url_path='submit-unit-of-measure')
    def submit_unit_of_measure(self, request, pk=None):
        """Submit unit of measure for approval."""
        obj = self.get_object()
        if obj.unit_of_measure_status in ['DRAFT', 'REJECTED']:
            obj.unit_of_measure_status = 'PENDING'
            obj.save()
            
            # Create notification for admins
            User = get_user_model()
            department_url = get_department_route(obj.branch.name if obj.branch else None)
            for admin_user in User.objects.filter(is_staff=True):
                Notification.objects.create(
                    recipient=admin_user,
                    message=f"Unit of measure for '{obj.subtitle.name} - {obj.criteria.name if obj.criteria else 'General'}' submitted for approval.",
                    url=department_url
                )
        return Response(self.get_serializer(obj).data)

    @action(detail=True, methods=['post'], url_path='approve-unit-of-measure')
    def approve_unit_of_measure(self, request, pk=None):
        """Admin approves unit of measure."""
        obj = self.get_object()
        obj.unit_of_measure_status = 'APPROVED'
        obj.save()
        
        # Create notification for approval
        User = get_user_model()
        department_url = get_department_route(obj.branch.name if obj.branch else None)
        for admin_user in User.objects.filter(is_staff=True):
            Notification.objects.create(
                recipient=admin_user,
                message=f"Unit of measure for '{obj.subtitle.name} - {obj.criteria.name if obj.criteria else 'General'}' was approved.",
                url=department_url
            )
        return Response(self.get_serializer(obj).data)

    @action(detail=True, methods=['post'], url_path='reject-unit-of-measure')
    def reject_unit_of_measure(self, request, pk=None):
        """Admin rejects unit of measure."""
        obj = self.get_object()
        comment = request.data.get('comment', '')
        obj.unit_of_measure_status = 'REJECTED'
        obj.rejection_comment = comment
        obj.save()
        
        # Create notification for rejection
        User = get_user_model()
        department_url = get_department_route(obj.branch.name if obj.branch else None)
        for admin_user in User.objects.filter(is_staff=True):
            Notification.objects.create(
                recipient=admin_user,
                message=f"Unit of measure for '{obj.subtitle.name} - {obj.criteria.name if obj.criteria else 'General'}' was rejected. Reason: {comment or 'No reason provided'}",
                url=department_url
            )
        return Response(self.get_serializer(obj).data)

    @action(detail=True, methods=['post'], url_path='quarters')
    def create_quarter(self, request, pk=None):
        """Create or get a quarterly progress record for given year & quarter."""
        obj = self.get_object()
        year = request.data.get('year')
        quarter = request.data.get('quarter')
        if not (year and quarter):
            return Response({'error': 'year and quarter required'}, status=status.HTTP_400_BAD_REQUEST)
        qp, created = QuarterlyProgress.objects.get_or_create(
            objective=obj, 
            year=year, 
            quarter=quarter, 
            defaults={'status': 'DRAFT'}
        )
        return Response({'id': qp.id, 'created': created})

class QuarterlyProgressViewSet(ModelViewSet):
    @action(detail=True, methods=['post'], url_path='upload-evidence')
    def upload_evidence(self, request, pk=None):
        """Upload evidence file for a quarterly progress record."""
        qp = self.get_object()
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided.'}, status=status.HTTP_400_BAD_REQUEST)
        qp.evidence = file
        qp.save()
        return Response({'message': 'Evidence uploaded successfully.'})
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
        # Allow editing after rejection
        qp.is_locked = False
        qp.save()

        # Create notification for rejection
        User = get_user_model()
        department_url = get_department_route(qp.objective.branch.name if qp.objective.branch else None)
        for admin_user in User.objects.filter(is_staff=True):
            Notification.objects.create(
                recipient=admin_user,
                message=f"Quarter {qp.quarter} {qp.year} progress for '{qp.objective.subtitle.name} - {qp.objective.criteria.name if qp.objective.criteria else 'General'}' was rejected. Reason: {comment or 'No reason provided'}",
                url=department_url
            )

        return Response(self.get_serializer(qp).data)

    @action(detail=True, methods=['post'], url_path='submit')
    def submit(self, request, pk=None):
        qp = self.get_object()
        if qp.status in ['DRAFT', 'REJECTED']:
            qp.status = 'PENDING'
            qp.is_locked = True
            qp.save()
        return Response(self.get_serializer(qp).data)