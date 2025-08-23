from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType


class Command(BaseCommand):
    help = "Assign permissions to system roles: USER, TECHNICIAN, HELPDESK_ADMIN, ADMIN"

    def handle(self, *args, **options):
        roles_permissions = {
            "USER": [
                # From posts app
                ("posts", "dimension", ["view_dimension"]),
                ("posts", "strategicobjective", ["view_strategicobjective"]),
                ("posts", "approvalstatus", ["view_approvalstatus"]),
                ("posts", "initiative", ["view_initiative"]),
                ("posts", "initiativeaction", ["add_initiativeaction","view_initiativeaction", "change_initiativeaction", "delete_initiativeaction"]),
                ("posts", "approvalentry", ["add_approvalentry", "view_approvalentry"]),
                # From authentication app
                ("authentication", "user", ["view_user"]),
            ],
            "INSTRUCTOR":  [
                # From posts app
                ("posts", "dimension", ["view_dimension"]),
                ("posts", "strategicobjective", ["add_strategicobjective", "view_strategicobjective", "change_strategicobjective", "delete_strategicobjective"]),
                ("posts", "approvalstatus", ["view_approvalstatus"]),
                ("posts", "initiative", ["add_initiative", "view_initiative", "change_initiative", "delete_initiative"]),
                ("posts", "initiativeaction", ["add_initiativeaction","view_initiativeaction", "change_initiativeaction", "delete_initiativeaction"]),
                ("posts", "approvalentry", ["add_approvalentry", "view_approvalentry"]),
                # From authentication app
                ("authentication", "user", ["view_user"]),
            ],
            "SYSTEM_ADMIN": [
                # From posts app
                ("posts", "dimension", ["add_dimension","view_dimension", "change_dimension", "delete_dimension"]),
                ("posts", "strategicobjective", ["add_strategicobjective", "view_strategicobjective", "change_strategicobjective", "delete_strategicobjective"]),
                ("posts", "approvalstatus", ["view_approvalstatus", "change_approvalstatus"]),
                ("posts", "initiative", ["add_initiative", "view_initiative", "change_initiative", "delete_initiative"]),
                ("posts", "initiativeaction", ["add_initiativeaction","view_initiativeaction", "change_initiativeaction", "delete_initiativeaction"]),
                ("posts", "approvalentry", ["add_approvalentry", "view_approvalentry", "change_approvalentry"]),
                # From authentication app
                ("authentication", "user", ["view_user", "change_user"]),
                # From Django auth
                ("auth", "group", ["add_group", "view_group", "change_group", "delete_group"]),
                ("auth", "permission", ["view_permission"]),
            ],
            "ADMIN": "ALL",  # Full permissions
        }

        for group_name, perms in roles_permissions.items():
            group, created = Group.objects.get_or_create(name=group_name)

            if perms == "ALL":
                group.permissions.set(Permission.objects.all())
                self.stdout.write(self.style.SUCCESS(f"{group_name}: All permissions assigned."))
                continue

            for app_label, model, codenames in perms:
                try:
                    content_type = ContentType.objects.get(app_label=app_label, model=model)
                    for codename in codenames:
                        try:
                            perm = Permission.objects.get(codename=codename, content_type=content_type)
                            group.permissions.add(perm)
                        except Permission.DoesNotExist:
                            self.stdout.write(
                                self.style.WARNING(f"Permission '{codename}' not found for model '{model}' in app '{app_label}'")
                            )
                except ContentType.DoesNotExist:
                    self.stdout.write(
                        self.style.WARNING(f"Model '{model}' not found in app '{app_label}'")
                    )

            self.stdout.write(self.style.SUCCESS(f"{group_name}: Permissions assigned."))

        self.stdout.write(self.style.SUCCESS("✅ All roles and permissions processed."))




