from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField(read_only=True)
    role_id = serializers.SerializerMethodField(read_only=True)
    role_name = serializers.ChoiceField(
        choices=[],  # We'll populate it in `__init__`
        write_only=True,
        required=False
    )
    full_name = serializers.ReadOnlyField()
    class Meta:
        model = User
        fields = [
            "id", "username", "first_name", "middle_name", "last_name", "email",
            "role", "role_id", "role_name", "dimension",
            "created_at", "updated_at"
        ]
        read_only_fields = [
            "id", "username", "first_name", "middle_name", "last_name", "email",
            "dimension", "created_at", "updated_at", "role", "role_id",
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Dynamically load group names as choices
        self.fields['role_name'].choices = [
            (group.name, group.name) for group in Group.objects.all()
        ]

    def get_role(self, obj):
        return obj.groups.first().name if obj.groups.exists() else None

    def get_role_id(self, obj):
        return obj.groups.first().id if obj.groups.exists() else None

    def validate_role_name(self, value):
        try:
            return Group.objects.get(name=value)
        except Group.DoesNotExist:
            raise serializers.ValidationError("Group does not exist.")

    # def validate(self, data):
    #     instance = self.instance

    #     # Determine effective group after update
    #     new_group = data.get("role_name")
    #     current_group = instance.groups.first() if instance else None
    #     current_group_name = current_group.name if current_group else None
    #     group = new_group or current_group_name


    #     return data

    def create(self, validated_data):
        raise serializers.ValidationError("Creation of users is not allowed.")

    def update(self, instance, validated_data):
        request = self.context.get("request")

        allowed_fields = {"role_name"}
        invalid_fields = set(validated_data.keys()) - allowed_fields
        if invalid_fields:
            raise serializers.ValidationError(
                f"Only 'role_name' can be updated. Invalid fields: {', '.join(invalid_fields)}"
            )

        group_name = validated_data.pop("role_name", None)
        if group_name:
            group = Group.objects.get(name=group_name)
            instance.groups.clear()
            instance.groups.add(group)

            instance.is_superuser = group.name == "ADMIN"
            instance.is_staff = group.name == "ADMIN"

        if request and request.user.is_authenticated:
            validated_data["modified_by"] = request.user

        return super().update(instance, validated_data)

class GroupCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ["id","name"]

    def validate_name(self, value):
        if Group.objects.filter(name__iexact=value).exists():
            raise serializers.ValidationError("A group with this name already exists.")
        return value

class GroupPermissionUpdateSerializer(serializers.ModelSerializer):
    add_permissions = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False,
        help_text="List of permission codenames to add to the group."
    )
    remove_permissions = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False,
        help_text="List of permission codenames to remove from the group."
    )
    current_permissions = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Group
        fields = ["id", "name", "add_permissions", "remove_permissions", "current_permissions"]

    def get_current_permissions(self, group):
        return [
            {
                "id": perm.id,
                "codename": perm.codename,
                "name": perm.name,
                "app_label": perm.content_type.app_label,
                "model": perm.content_type.model,
            }
            for perm in group.permissions.select_related("content_type").all()
        ]

    def validate(self, data):
        all_ids = set(data.get('add_permissions', []) + data.get('remove_permissions', []))
        invalid = []
        for perm_id in all_ids:
            if not Permission.objects.filter(id=perm_id).exists():
                invalid.append(str(perm_id))
        if invalid:
            raise serializers.ValidationError(f"Invalid permission IDs: {', '.join(invalid)}")
        return data

    def update(self, instance, validated_data):
        add_permissions = validated_data.pop("add_permissions", [])
        remove_permissions = validated_data.pop("remove_permissions", [])

        if add_permissions:
            instance.permissions.add(*Permission.objects.filter(id__in=add_permissions))
        if remove_permissions:
            instance.permissions.remove(*Permission.objects.filter(id__in=remove_permissions))

        return super().update(instance, validated_data)