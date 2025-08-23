from django.db import models
from django.contrib.auth.models import AbstractUser, Group
from django.core.exceptions import ValidationError

class User(AbstractUser):
    email = models.EmailField(unique=True, null=False, blank=False)
    middle_name = models.CharField(max_length=200, null=True, blank=True)
    dimension = models.ForeignKey("posts.Dimension", on_delete=models.PROTECT, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    modified_by = models.ForeignKey("self", on_delete=models.PROTECT, null=True, blank=True)
    @property
    def get_full_name(self):
        return " ".join(filter(None, [self.first_name, self.middle_name, self.last_name]))
    @property
    def role(self):
        """Return the user's first group name, if any."""
        return self.groups.first().name if self.groups.exists() else None
    
    def save(self, *args, **kwargs):
        is_new = self._state.adding  # True if user is being created
        super().save(*args, **kwargs)

        # Assign default group only when user is first created
        if is_new and not self.groups.exists():
            default_group, _ = Group.objects.get_or_create(name="USER")
            self.groups.set([default_group])

    def __str__(self):
        return f"{self.get_full_name} ({self.role})"
