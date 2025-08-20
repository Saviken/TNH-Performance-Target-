from rest_framework import serializers
from django.contrib.auth.models import User
from posts.models_user import UserProfile
from posts.models_department import Branch

class UserProfileSerializer(serializers.ModelSerializer):
    branch_name = serializers.CharField(source='branch.name', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['role', 'branch', 'branch_name', 'created_at', 'updated_at']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    role = serializers.CharField(write_only=True, required=False)
    branch = serializers.IntegerField(write_only=True, required=False)
    branch_name = serializers.CharField(source='profile.branch.name', read_only=True)
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'is_active', 'date_joined', 'last_login', 'profile', 
                  'role', 'branch', 'branch_name', 'password']
        
    def create(self, validated_data):
        # Extract profile data
        role = validated_data.pop('role', 'HeadOfDepartment')
        branch_id = validated_data.pop('branch', None)
        password = validated_data.pop('password', None)
        
        # Create user
        user = User.objects.create_user(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        
        # Create or update profile
        branch = None
        if branch_id:
            try:
                branch = Branch.objects.get(id=branch_id)
            except Branch.DoesNotExist:
                pass
                
        UserProfile.objects.create(
            user=user,
            role=role,
            branch=branch
        )
        
        return user
    
    def update(self, instance, validated_data):
        # Extract profile data
        role = validated_data.pop('role', None)
        branch_id = validated_data.pop('branch', None)
        password = validated_data.pop('password', None)
        
        # Update user
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        instance.save()
        
        # Update profile
        profile, created = UserProfile.objects.get_or_create(user=instance)
        if role:
            profile.role = role
        if branch_id:
            try:
                profile.branch = Branch.objects.get(id=branch_id)
            except Branch.DoesNotExist:
                pass
        elif branch_id == '':  # Empty string to clear branch
            profile.branch = None
        profile.save()
        
        return instance
