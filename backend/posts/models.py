
# Criteria model for admin control
from django.db import models

class Criteria(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


# Subtitle now relates to Branch

from django.contrib.auth import get_user_model
from .models_department import Branch

class Subtitle(models.Model):
    name = models.CharField(max_length=255, unique=True)
    division = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name="subtitles", null=True, blank=True)

    def __str__(self):
        return self.name


class Post(models.Model):
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name="posts", null=True, blank=True)
    subtitle = models.ForeignKey(Subtitle, on_delete=models.CASCADE, related_name="posts", null=True, blank=True)
    criteria = models.ForeignKey(Criteria, on_delete=models.SET_NULL, null=True, blank=True, related_name="posts")
    unit_of_measure = models.CharField(max_length=100, default="N/A")
    weight = models.CharField(max_length=100, default="N/A")
    status_yr_2024 = models.CharField(max_length=100, default="N/A")
    annual_target = models.CharField(max_length=100, default="N/A")
    cummulative_target = models.CharField(max_length=100, default="N/A")
    cummulative_actual = models.CharField(max_length=100, default="N/A")
    statistical_explanation = models.CharField(max_length=255, default="N/A")
    factors_contributing = models.CharField(max_length=255, default="N/A")
    raw_score = models.CharField(max_length=100, default="N/A")
    wtd_score = models.CharField(max_length=100, default="N/A")
    wtd_achievement = models.CharField(max_length=100, default="N/A")
    rank = models.CharField(max_length=50, default="N/A")
    status_of_activities = models.CharField(max_length=255, default="N/A")
    attachment = models.FileField(
        upload_to="attachments/",
        null=True,
        blank=True,
        help_text="Upload Word, PDF, JPEG, or PNG files."
    )
    STATUS_CHOICES = [
        ("DRAFT", "Draft"),
        ("PENDING", "Pending Approval"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="DRAFT")
    is_locked = models.BooleanField(default=False, help_text="When true, editing is disabled until unlocked by an administrator.")

    def __str__(self):
        return f"{self.branch} - {self.criteria}"


class PerformanceObjective(models.Model):
    """Annual baseline objective (subtitle + criteria + unit of measure)."""
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name="objectives")
    subtitle = models.ForeignKey(Subtitle, on_delete=models.CASCADE, related_name="objectives")
    criteria = models.ForeignKey(Criteria, on_delete=models.SET_NULL, null=True, blank=True, related_name="objectives")
    unit_of_measure = models.CharField(max_length=255)
    weight = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    annual_target = models.CharField(max_length=100, default="N/A")
    description = models.TextField(blank=True, null=True)
    rejection_comment = models.TextField(blank=True, null=True, help_text="Admin provided reason when objective is rejected.")
    
    # Two-stage workflow fields
    UNIT_STATUS_CHOICES = [
        ("DRAFT", "Draft"),
        ("PENDING", "Pending Approval"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
    ]
    unit_of_measure_status = models.CharField(max_length=20, choices=UNIT_STATUS_CHOICES, default="DRAFT")
    
    STATUS_CHOICES = [
        ("DRAFT", "Draft"),
        ("PENDING", "Pending Approval"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="DRAFT")
    is_locked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Objective {self.id} - {self.subtitle} / {self.criteria}" if self.criteria else f"Objective {self.id} - {self.subtitle}"

    class Meta:
        unique_together = ("branch", "subtitle", "criteria")
        indexes = [
            models.Index(fields=["branch", "subtitle", "criteria"], name="obj_br_sub_cr_idx"),
        ]


class Notification(models.Model):
    recipient = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="notifications")
    message = models.CharField(max_length=255)
    url = models.CharField(max_length=255)  # URL to direct user to updated page
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"To {self.recipient}: {self.message}"

class QuarterlyProgress(models.Model):
    """Quarterly performance entries for an approved baseline objective."""
    objective = models.ForeignKey(PerformanceObjective, on_delete=models.CASCADE, related_name="quarters")
    year = models.IntegerField()
    quarter = models.IntegerField()  # 1-4
    # Quarter data
    target_quarter = models.CharField(max_length=100, blank=True, null=True)
    actual_quarter = models.CharField(max_length=100, blank=True, null=True)
    cumulative_actual = models.CharField(max_length=100, blank=True, null=True)
    explanation = models.TextField(blank=True, null=True)
    contributing_factors = models.TextField(blank=True, null=True)
    raw_score = models.CharField(max_length=50, blank=True, null=True)
    wtd_score = models.CharField(max_length=50, blank=True, null=True)
    wtd_achievement = models.CharField(max_length=50, blank=True, null=True)
    rank = models.CharField(max_length=50, blank=True, null=True)
    STATUS_CHOICES = [
        ("DRAFT", "Draft"),
        ("PENDING", "Pending Approval"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="DRAFT")
    is_locked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("objective", "year", "quarter")
        ordering = ["objective", "year", "quarter"]

    def __str__(self):
        return f"Quarter {self.quarter} {self.year} for Objective {self.objective_id}"


# Import strategic objectives models
from .models_strategic_objectives import StrategicObjective, StrategicCriteria, KeyMetric, ActionItem
