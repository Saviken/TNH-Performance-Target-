from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from posts.models_user import UserProfile
from posts.models_department import Branch
from posts.api.serializers_user import UserSerializer, UserProfileSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Admin can see all users
        user_profile = getattr(self.request.user, 'profile', None)
        if user_profile and user_profile.role == 'Admin':
            return User.objects.select_related('profile', 'profile__branch').all()
        
        # CEO can see all users
        if user_profile and user_profile.role == 'CEO':
            return User.objects.select_related('profile', 'profile__branch').all()
        
        # Head of Department can see users in their branch
        if user_profile and user_profile.role == 'HeadOfDepartment' and user_profile.branch:
            return User.objects.select_related('profile', 'profile__branch').filter(
                profile__branch=user_profile.branch
            )
        
        # Instructors can only see themselves
        return User.objects.filter(id=self.request.user.id)
    
    def perform_create(self, serializer):
        # Check if user has permission to create users
        user_profile = getattr(self.request.user, 'profile', None)
        if not user_profile or user_profile.role not in ['Admin', 'CEO']:
            raise permissions.PermissionDenied("Only Admins and CEOs can create users")
        
        serializer.save()
    
    def perform_update(self, serializer):
        # Check if user has permission to update this user
        user_profile = getattr(self.request.user, 'profile', None)
        target_user = serializer.instance
        
        # Users can always update themselves (except role changes)
        if self.request.user == target_user:
            # Check if trying to change role
            if 'role' in serializer.validated_data:
                if not user_profile or user_profile.role not in ['Admin', 'CEO']:
                    raise permissions.PermissionDenied("You cannot change your own role")
            serializer.save()
            return
        
        # Admin can update anyone
        if user_profile and user_profile.role == 'Admin':
            serializer.save()
            return
        
        # CEO can update anyone
        if user_profile and user_profile.role == 'CEO':
            serializer.save()
            return
        
        # Head of Department can update users in their branch
        if user_profile and user_profile.role == 'HeadOfDepartment' and user_profile.branch:
            target_profile = getattr(target_user, 'profile', None)
            if target_profile and target_profile.branch == user_profile.branch:
                serializer.save()
                return
        
        raise permissions.PermissionDenied("You don't have permission to update this user")
    
    def perform_destroy(self, instance):
        # Check if user has permission to delete this user
        user_profile = getattr(self.request.user, 'profile', None)
        
        # Prevent self-deletion
        if self.request.user == instance:
            raise permissions.PermissionDenied("You cannot delete yourself")
        
        # Only Admin and CEO can delete users
        if not user_profile or user_profile.role not in ['Admin', 'CEO']:
            raise permissions.PermissionDenied("Only Admins and CEOs can delete users")
        
        instance.delete()
    
    @action(detail=False, methods=['get'])
    def profile(self, request):
        """Get current user's profile"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def assign_role(self, request, pk=None):
        """Assign role to a user"""
        user = self.get_object()
        user_profile = getattr(request.user, 'profile', None)
        
        # Only Admin and CEO can assign roles
        if not user_profile or user_profile.role not in ['Admin', 'CEO']:
            raise permissions.PermissionDenied("Only Admins and CEOs can assign roles")
        
        role = request.data.get('role')
        branch_id = request.data.get('branch')
        
        if not role:
            return Response(
                {'error': 'Role is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get or create profile
        profile, created = UserProfile.objects.get_or_create(user=user)
        profile.role = role
        
        # Set branch if provided
        if branch_id:
            try:
                branch = Branch.objects.get(id=branch_id)
                profile.branch = branch
            except Branch.DoesNotExist:
                return Response(
                    {'error': 'Invalid branch ID'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        profile.save()
        
        serializer = self.get_serializer(user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def roles(self, request):
        """Get available roles"""
        return Response({
            'roles': [
                {'value': 'Admin', 'label': 'System Administrator'},
                {'value': 'CEO', 'label': 'Chief Executive Officer'},
                {'value': 'HeadOfDepartment', 'label': 'Head of Department'},
                {'value': 'Instructor', 'label': 'Instructor'},
            ]
        })
    
    @action(detail=False, methods=['get'])
    def branches(self, request):
        """Get available branches"""
        branches = Branch.objects.all()
        return Response({
            'branches': [
                {'id': branch.id, 'name': branch.name, 'description': branch.description}
                for branch in branches
            ]
        })
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get user statistics"""
        user_profile = getattr(request.user, 'profile', None)
        
        # Only Admin and CEO can see stats
        if not user_profile or user_profile.role not in ['Admin', 'CEO']:
            raise permissions.PermissionDenied("Only Admins and CEOs can view user statistics")
        
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        
        # Count by roles
        role_counts = {}
        for role_choice in UserProfile.ROLE_CHOICES:
            role_value = role_choice[0]
            count = UserProfile.objects.filter(role=role_value).count()
            role_counts[role_value] = count
        
        # Count by branches
        branch_counts = {}
        for branch in Branch.objects.all():
            count = UserProfile.objects.filter(branch=branch).count()
            branch_counts[branch.name] = count
        
        return Response({
            'total_users': total_users,
            'active_users': active_users,
            'inactive_users': total_users - active_users,
            'role_distribution': role_counts,
            'branch_distribution': branch_counts
        })
