import logging
# from django_auth_ldap.backend import populate_user, LDAPBackend
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth.models import User, Group

logger = logging.getLogger("django_auth_ldap")

# @receiver(populate_user, sender=LDAPBackend)
# def set_user_active_based_on_ldap(user, ldap_user, **kwargs):
#     """Sets user as active or inactive based on Active Directory's userAccountControl"""
    
#     # Extract userAccountControl attribute (it's a list, so we get the first item)
#     user_account_control = ldap_user.attrs.get("userAccountControl", [None])[0]

#     if user_account_control is not None:
#         try:
#             user_account_control = int(user_account_control)
#             user.is_active = (user_account_control & 2) == 0  # Check if ACCOUNTDISABLE flag is set
#             logger.debug(f"User {user.username} - userAccountControl: {user_account_control}, is_active: {user.is_active}")
#         except ValueError:
#             logger.error(f"Invalid userAccountControl value for {user.username}: {user_account_control}")
#             user.is_active = False  # Default to inactive if there's an issue
#     else:
#         logger.warning(f"userAccountControl attribute not found for {user.username}")
#         user.is_active = False  # Default to inactive if missing

@receiver(post_save, sender=User)
def assign_superuser_group(sender, instance, created, **kwargs):
    if created and instance.is_superuser:
        admin_group, _ = Group.objects.get_or_create(name="ADMIN")
        instance.groups.set([admin_group])
        instance.save()
