from django.core.management.base import BaseCommand
from django.db import transaction
from decimal import Decimal, InvalidOperation

from posts.models import Post, PerformanceObjective


class Command(BaseCommand):
    help = "Create PerformanceObjective baseline records from existing Post entries (one per branch+subtitle+criteria)."

    def add_arguments(self, parser):
        parser.add_argument('--dry-run', action='store_true', help='Show what would happen without writing to DB.')
        parser.add_argument('--include-status', action='store_true', help='Copy status/is_locked from Post if available.')

    def handle(self, *args, **options):
        dry = options['dry_run']
        include_status = options['include_status']

        posts = Post.objects.select_related('branch', 'subtitle', 'criteria')
        if not posts.exists():
            self.stdout.write(self.style.WARNING('No Post records found. Nothing to migrate.'))
            return

        created = 0
        skipped = 0
        updated = 0

        by_key = {}
        for p in posts:
            if not p.branch or not p.subtitle:
                continue
            key = (p.branch_id, p.subtitle_id, p.criteria_id)
            if key not in by_key:
                by_key[key] = p

        self.stdout.write(f'Found {len(by_key)} unique (branch, subtitle, criteria) combinations to migrate.')

        @transaction.atomic
        def migrate():
            nonlocal created, skipped, updated
            for (branch_id, subtitle_id, criteria_id), post in by_key.items():
                try:
                    weight_val = None
                    if post.weight and post.weight not in ('N/A', ''):
                        try:
                            weight_val = Decimal(str(post.weight))
                        except InvalidOperation:
                            weight_val = None
                    obj, was_created = PerformanceObjective.objects.get_or_create(
                        branch=post.branch,
                        subtitle=post.subtitle,
                        criteria=post.criteria,
                        defaults={
                            'unit_of_measure': post.unit_of_measure or 'N/A',
                            'weight': weight_val,
                            'annual_target': post.annual_target if post.annual_target and post.annual_target != 'N/A' else (post.cummulative_target or 'N/A'),
                        }
                    )
                    if was_created:
                        created += 1
                        if include_status:
                            obj.status = post.status or 'DRAFT'
                            obj.is_locked = post.is_locked
                            obj.save(update_fields=['status', 'is_locked'])
                    else:
                        changed = False
                        if not obj.unit_of_measure and post.unit_of_measure:
                            obj.unit_of_measure = post.unit_of_measure
                            changed = True
                        if (not obj.annual_target or obj.annual_target == 'N/A') and post.annual_target and post.annual_target != 'N/A':
                            obj.annual_target = post.annual_target
                            changed = True
                        if weight_val is not None and obj.weight is None:
                            obj.weight = weight_val
                            changed = True
                        if include_status and obj.status == 'DRAFT' and post.status and post.status != obj.status:
                            obj.status = post.status
                            changed = True
                        if changed:
                            obj.save()
                            updated += 1
                        else:
                            skipped += 1
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Error migrating post {post.id}: {e}'))

        if dry:
            self.stdout.write(self.style.WARNING('Dry-run mode: no database changes will be committed.'))
        else:
            migrate()
        self.stdout.write(self.style.SUCCESS(f'Migration summary: created={created}, updated={updated}, skipped={skipped}'))
