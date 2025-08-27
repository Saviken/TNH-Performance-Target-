from django.db import models
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
User = get_user_model()

def validate_file_extension(value):
    validator = FileExtensionValidator(allowed_extensions=['pdf', 'jpg', 'png', 'docx', 'jpeg'])
    validator(value)

class Dimension(models.Model):
    name = models.CharField(max_length=100, unique=True)
    head = models.ForeignKey(User, on_delete=models.PROTECT, null=True, blank=True, related_name="dim_lead", related_query_name="dim_lead")
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, null=True, blank=True, related_name="dim_creator", related_query_name="dim_creator")
    created_at = models.DateTimeField(auto_now_add=True)
    modified_by = models.ForeignKey(User, on_delete=models.PROTECT, null=True, blank=True, related_name="dim_modifier", related_query_name="dim_modifier")
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
class StrategicObjective(models.Model):
    name = models.CharField(max_length=255, unique=True)
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, null=False, blank=False, related_name="obj_creators", related_query_name="obj_creators")
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    modified_by = models.ForeignKey(User, on_delete=models.PROTECT, null=True, blank=True, related_name="obj_modifiers", related_query_name="obj_modifiers")

    def __str__(self):
        return self.name

class ApprovalStatus(models.Model):
    code = models.CharField(max_length=25, primary_key=True)
    description = models.CharField(max_length=150, null=False, blank=False)
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, null=False, blank=False, related_name="apsts_creators", related_query_name="apsts_creators")
    created_at = models.DateTimeField(auto_now_add=True)
    modified_by = models.ForeignKey(User, on_delete=models.PROTECT, null=True, blank=True, related_name="apsts_modifiers", related_query_name="apsts_modifiers")
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Approval Statuses"
    
    def __str__(self):
        return f"{self.description} status"
    
    def save(self, *args, **kwargs):
        self.code = self.code.upper()
        super().save(*args, **kwargs)
    
class Initiative(models.Model):
    objective = models.ForeignKey(StrategicObjective, on_delete=models.PROTECT, null=False, blank=False)
    description = models.TextField(null=False, blank=False)
    unit_of_measure = models.TextField(null=False, blank=False)
    weight = models.DecimalField(max_digits=4, decimal_places=3)
    previous_target = models.DecimalField(max_digits=4, decimal_places=3)
    current_target = models.DecimalField(max_digits=4, decimal_places=3)
    cumulative_target = models.DecimalField(max_digits=4, decimal_places=3)
    status = models.ForeignKey(ApprovalStatus, on_delete=models.PROTECT, null=True, blank=True, related_name="init_sts", related_query_name="init_sts")
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, null=False, blank=False, related_name="init_creators", related_query_name="init_creators")
    modified_at = models.DateTimeField(auto_now=True)
    modified_by = models.ForeignKey(User, on_delete=models.PROTECT, null=True, blank=True, related_name="init_modifiers", related_query_name="init_modifiers")

    def __str__(self):
        return f"{self.description}"
    
    def save(self, *args, **kwargs):

        if not self.status_id:
            try:
                self.status = ApprovalStatus.objects.get(code="OPEN")
            except ApprovalStatus.DoesNotExist:
                raise ValidationError("Default 'OPEN' status does not exist. Please create it first.")

        super().save(*args, **kwargs)
    
class InitiativeAction(models.Model):
    STATUS_CHOICES = [
        ('on_track', 'On Track'),
        ('in_progress', 'In Progress'),
        ('exceeding_target', 'Exceeding Target'),
        ('behind_schedule', 'Behind Schedule'),
        ('completed', 'Completed'),
    ]
    initiative = models.ForeignKey(Initiative, on_delete=models.PROTECT, null=False, blank=False)
    cummulative_actual = models.DecimalField(max_digits=4, decimal_places=3)
    action_description = models.TextField(null=False, blank=False)
    action_factor = models.TextField(null=False, blank=False)
    raw_score = models.DecimalField(max_digits=4, decimal_places=2)
    weighted_score = models.DecimalField(max_digits=4, decimal_places=2)
    weighted_achieved = models.DecimalField(max_digits=4, decimal_places=2)
    progress = models.IntegerField(default=0, help_text="Progress percentage (0-100)") # review
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress') # Create property
    created_at = models.DateTimeField(auto_now_add=True)
    deadline = models.CharField(max_length=100, help_text="Target deadline (e.g., Q4 2024)")
    evidence = models.FileField(upload_to="attachments/", null=True, blank=True, validators=[validate_file_extension], help_text="Upload Word, PDF, JPEG, or PNG files.")
    # define property
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

class ApprovalEntry(models.Model):
    requestor = models.ForeignKey(User, on_delete=models.PROTECT, null=False, blank=False, related_name="app_reqs", related_query_name="app_reqs")
    approval_entry = models.ForeignKey(Initiative, on_delete=models.PROTECT, null=False, blank=False, related_name="appent_inits", related_query_name="appent_inits")
    requested_at = models.DateTimeField(auto_now_add=True)
    approver = models.ForeignKey(User, on_delete=models.PROTECT, null=False, blank=False, related_name="app_apvs", related_query_name="app_apvs")
    actioned_at = models.DateTimeField(null=True, blank=True)
    status = models.ForeignKey(ApprovalStatus, on_delete=models.PROTECT, null=False, blank=False, related_name="app_statuses", related_query_name="app_statuses")
    comment = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"Approval request {self.id} by {self.requestor} for {self.approver}"
    
    class Meta:
        verbose_name_plural = "Approval Entries"