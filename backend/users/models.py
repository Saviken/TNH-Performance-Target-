from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=50, choices=[
        ('ADMIN', 'Admin'),
        ('CEO', 'CEO'),
        ('HEAD_OF_DEPARTMENT', 'Head of Department'),
        ('INSTRUCTOR', 'Instructor'),
    ])
    department = models.CharField(max_length=100, blank=True)
    branch = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.role})"
