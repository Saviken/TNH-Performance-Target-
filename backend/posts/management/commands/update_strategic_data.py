from django.core.management.base import BaseCommand
from posts.models_department import Branch

class Command(BaseCommand):
    help = 'Populate basic department/role separation data for Hospital Dashboard.'

    def handle(self, *args, **options):
        # Create sample branches (departments)
        departments = [
            {'name': 'Medical Services', 'head': 'Dr. Sarah Johnson'},
            {'name': 'Finance', 'head': 'Mr. Michael Chen'},
            {'name': 'Strategy & Innovation', 'head': 'Ms. Emma Rodriguez'},
            {'name': 'Human Resources', 'head': 'Ms. Jane Doe'},
            {'name': 'ICT', 'head': 'Mr. John Smith'},
            {'name': 'Nursing Services', 'head': 'Ms. Mary White'},
            {'name': 'Engineering', 'head': 'Mr. Paul Black'},
            {'name': 'Legal', 'head': 'Ms. Susan Green'},
            {'name': 'Internal Audit', 'head': 'Mr. Alan Brown'},
        ]

        for dept in departments:
            branch, created = Branch.objects.get_or_create(
                name=dept['name'],
                defaults={'head': dept['head']}
            )
            self.stdout.write(f"{'Created' if created else 'Found'} department: {branch.name} (Head: {branch.head})")

        self.stdout.write(self.style.SUCCESS('Departments/roles setup complete.'))
