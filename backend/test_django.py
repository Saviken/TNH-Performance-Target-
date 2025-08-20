import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from posts.models import PerformanceObjective
from posts.models_department import Branch

print("Django setup OK")
print("Objectives count:", PerformanceObjective.objects.count())
print("Branches count:", Branch.objects.count())

# Try to create a simple objective for testing
branch, created = Branch.objects.get_or_create(
    name="Medical Services",
    defaults={'description': 'Medical Services Department'}
)
print(f"Branch {'created' if created else 'exists'}: {branch.name}")
