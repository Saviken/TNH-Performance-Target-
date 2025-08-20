#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Setup Django
django.setup()

from posts.models import PerformanceObjective, Branch, Subtitle, Criteria

def populate_sample_data():
    """Populate sample performance objectives data"""
    print("Starting data population...")
    
    # Sample data
    samples = [
        ("Medical Services", "Clinical Excellence", "Patient Satisfaction"),
        ("Medical Services", "Clinical Excellence", "Average Length of Stay"),
        ("Medical Services", "Quality & Safety", "Infection Control"),
        ("Medical Services", "Quality & Safety", "Medical Error Rate"),
        ("Medical Services", "Patient Care", "Readmission Rate"),
        ("Finance", "Financial Performance", "Revenue Growth"),
        ("Finance", "Financial Performance", "Cost Management"),
        ("Finance", "Budget Management", "Budget Variance"),
        ("Human Resources", "Staff Development", "Training Completion"),
        ("Human Resources", "Employee Satisfaction", "Retention Rate"),
    ]
    
    created_count = 0
    for branch_name, subtitle_name, criteria_name in samples:
        # Get or create branch
        branch, _ = Branch.objects.get_or_create(
            name=branch_name,
            defaults={'head': f'Head of {branch_name}'}
        )
        
        # Get or create subtitle
        subtitle, _ = Subtitle.objects.get_or_create(
            name=subtitle_name,
            defaults={'division': branch}
        )
        if subtitle.division_id is None:
            subtitle.division = branch
            subtitle.save(update_fields=['division'])
        
        # Get or create criteria
        criteria, _ = Criteria.objects.get_or_create(
            name=criteria_name
        )
        
        # Create performance objective
        obj, created = PerformanceObjective.objects.get_or_create(
            branch=branch,
            subtitle=subtitle,
            criteria=criteria,
            defaults={
                'unit_of_measure': 'Percentage',
                'annual_target': '95%',
                'weight': 10.0,
                'unit_of_measure_status': 'APPROVED',
            }
        )
        
        if created:
            created_count += 1
            print(f"Created: {branch_name} -> {subtitle_name} -> {criteria_name}")
    
    total_count = PerformanceObjective.objects.count()
    print(f"\nData population complete!")
    print(f"New objectives created: {created_count}")
    print(f"Total objectives in database: {total_count}")

if __name__ == '__main__':
    populate_sample_data()
