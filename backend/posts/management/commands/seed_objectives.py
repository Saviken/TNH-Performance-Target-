from django.core.management.base import BaseCommand
from django.db import transaction
from posts.models import Post, PerformanceObjective, Branch, Subtitle, Criteria

class Command(BaseCommand):
    help = "Seed PerformanceObjective records from existing Post rows (one per branch+subtitle+criteria)."

    def add_arguments(self, parser):
        parser.add_argument('--dry-run', action='store_true', help='Show actions without writing to DB.')

    def handle(self, *args, **options):
        dry = options['dry_run']
        posts = Post.objects.select_related('branch', 'subtitle', 'criteria')
        if not posts.exists():
            self.stdout.write(self.style.WARNING('No Post records found. Seeding a few sample objectives directly.'))
            samples = [
                ("Medical Services", "Clinical Excellence", "Patient Satisfaction"),
                ("Medical Services", "Clinical Excellence", "Average Length of Stay"),
                ("Medical Services", "Quality & Safety", "Infection Control"),
            ]
            created_samples = 0
            for branch_name, subtitle_name, criteria_name in samples:
                branch, _ = Branch.objects.get_or_create(name=branch_name)
                subtitle, _ = Subtitle.objects.get_or_create(name=subtitle_name, defaults={"division": branch})
                if subtitle.division_id is None:
                    subtitle.division = branch
                    subtitle.save(update_fields=["division"])
                criteria, _ = Criteria.objects.get_or_create(name=criteria_name)
                obj, made = PerformanceObjective.objects.get_or_create(
                    branch=branch,
                    subtitle=subtitle,
                    criteria=criteria,
                    defaults={
                        'unit_of_measure': 'Units',
                        'annual_target': 'N/A',
                    }
                )
                if made:
                    created_samples += 1
            self.stdout.write(self.style.SUCCESS(f"Sample objectives created: {created_samples}. Total objectives: {PerformanceObjective.objects.count()}"))
            return

        unique = {}
        for p in posts:
            if not p.branch or not p.subtitle:
                continue
            key = (p.branch_id, p.subtitle_id, p.criteria_id)
            if key not in unique:
                unique[key] = p

        self.stdout.write(f'Found {len(unique)} unique baseline combinations.')
        created = 0
        skipped = 0

        @transaction.atomic
        def do_create():
            nonlocal created, skipped
            for key, p in unique.items():
                obj, made = PerformanceObjective.objects.get_or_create(
                    branch=p.branch,
                    subtitle=p.subtitle,
                    criteria=p.criteria,
                    defaults={
                        'unit_of_measure': p.unit_of_measure or 'N/A',
                        'annual_target': p.annual_target if p.annual_target and p.annual_target != 'N/A' else (p.cummulative_target or 'N/A'),
                    }
                )
                if made:
                    created += 1
                else:
                    skipped += 1

        if dry:
            self.stdout.write(self.style.WARNING('Dry run only. No DB changes.'))
        else:
            do_create()
        self.stdout.write(self.style.SUCCESS(f'Created: {created}, Skipped existing: {skipped}'))
