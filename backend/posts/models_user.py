from django.db import models
from django.contrib.auth.models import User
from posts.models_department import Branch

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('Instructor', 'Instructor'),
        ('CEO', 'CEO'), 
        ('HeadOfDepartment', 'Head of Department'),
        ('Admin', 'Admin'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='HeadOfDepartment')
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.role}"
    
    class Meta:
        db_table = 'user_profile'
