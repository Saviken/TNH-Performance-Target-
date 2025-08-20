from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'name', 'role', 'department', 'branch', 'is_active', 'created_at', 'last_login']
        read_only_fields = ['id', 'created_at']

class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'name', 'role', 'department', 'branch']
        
    def create(self, validated_data):
        return CustomUser.objects.create(**validated_data)
