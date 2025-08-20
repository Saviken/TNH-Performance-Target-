#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from posts.models_department import Branch
from posts.models import Post

print("=== Database Test ===")
print(f"Branches in database: {Branch.objects.count()}")
for branch in Branch.objects.all():
    print(f"  - {branch.name}")

print(f"\nPosts in database: {Post.objects.count()}")

# Check for Medical Services branch
medical_branches = Branch.objects.filter(name__icontains='Medical')
print(f"\nBranches containing 'Medical': {medical_branches.count()}")
for branch in medical_branches:
    print(f"  - {branch.name}")
    posts_count = Post.objects.filter(branch=branch).count()
    print(f"    Posts in this branch: {posts_count}")
