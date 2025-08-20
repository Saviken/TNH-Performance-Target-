from django.db import models
from .models_department import Branch

class StrategicObjective(models.Model):
    STATUS_CHOICES = [
        ('on_track', 'On Track'),
        ('in_progress', 'In Progress'),
        ('exceeding_target', 'Exceeding Target'),
        ('behind_schedule', 'Behind Schedule'),
        ('completed', 'Completed'),
    ]
    
    PRIORITY_CHOICES = [
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='strategic_objectives')
    progress = models.IntegerField(default=0, help_text="Progress percentage (0-100)")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    target = models.CharField(max_length=255, help_text="Target description")
    deadline = models.CharField(max_length=100, help_text="Target deadline (e.g., Q4 2024)")
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    criteria_count = models.IntegerField(default=0, help_text="Number of criteria under this objective")
    objectives_count = models.IntegerField(default=0, help_text="Number of sub-objectives under this objective")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-priority', '-progress']

    def __str__(self):
        return f"{self.branch.name} - {self.title}"

    @property
    def color(self):
        """Return color based on status for frontend display"""
        color_map = {
            'on_track': 'success',
            'in_progress': 'warning', 
            'exceeding_target': 'primary',
            'behind_schedule': 'error',
            'completed': 'success',
        }
        return color_map.get(self.status, 'default')


class StrategicCriteria(models.Model):
    """Criteria under each strategic objective"""
    strategic_objective = models.ForeignKey(StrategicObjective, on_delete=models.CASCADE, related_name='criteria')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2, default=0.0, help_text="Weight percentage")
    target_value = models.CharField(max_length=100, blank=True, null=True)
    actual_value = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['title']

    def __str__(self):
        return f"{self.strategic_objective.title} - {self.title}"


class KeyMetric(models.Model):
    label = models.CharField(max_length=255)
    value = models.CharField(max_length=100)
    trend = models.CharField(max_length=50, help_text="e.g., +5%, -2%")
    icon_name = models.CharField(max_length=100, help_text="Icon name for frontend")
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='key_metrics')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['label']

    def __str__(self):
        return f"{self.branch.name} - {self.label}: {self.value}"


class ActionItem(models.Model):
    ACTION_TYPES = [
        ('priority', 'Priority Action'),
        ('achievement', 'Recent Achievement'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    action_type = models.CharField(max_length=20, choices=ACTION_TYPES, default='priority')
    due_date = models.CharField(max_length=100, blank=True, null=True)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='action_items')
    icon_name = models.CharField(max_length=100, help_text="Icon name for frontend")
    completed_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.branch.name} - {self.title}"
