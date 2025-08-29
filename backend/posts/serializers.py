from rest_framework import serializers
from .models import StrategicObjective, Dimension, Initiative, InitiativeAction, ApprovalEntry, ApprovalStatus

class DimensionSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.get_full_name')
    modified_by = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(format="%b %d, %Y %I:%M %p", read_only=True)
    modified_at = serializers.DateTimeField(format="%b %d, %Y %I:%M %p", read_only=True)
    class Meta:
        model = Dimension
        fields = ['id', 'name', 'head', 'created_by', 'created_at', 'modified_by', 'modified_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'modified_by', 'modified_at']
    
    def get_modified_by(self, obj):
        return obj.modified_by.get_full_name if obj.modified_by else None

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['created_by'] = request.user
        
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        " Set record modifier "
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['modified_by'] = request.user
        return super().update(instance, validated_data)

class StrategicObjectiveSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.get_full_name')
    modified_by = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(format="%b %d, %Y %I:%M %p", read_only=True)
    modified_at = serializers.DateTimeField(format="%b %d, %Y %I:%M %p", read_only=True)

    class Meta:
        model = StrategicObjective
        fields = [
            'id', 'name', 'created_by', 'created_at', 'modified_by', 'modified_at'
        ]
        read_only_fields = ['id','created_by', 'created_at', 'modified_by', 'modified_at']

    def get_modified_by(self, obj):
        return obj.modified_by.get_full_name if obj.modified_by else None

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['created_by'] = request.user
        
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        " Set record modifier "
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['modified_by'] = request.user
        return super().update(instance, validated_data)
    
class InitiativeSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.get_full_name')
    modified_by = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(format="%b %d, %Y %I:%M %p", read_only=True)
    modified_at = serializers.DateTimeField(format="%b %d, %Y %I:%M %p", read_only=True)

    class Meta:
        model = Initiative
        fields = [
            'id', 'objective', 'dimension', 'description', 'unit_of_measure', 'weight', 'previous_target', 'current_target', 'cumulative_target',
            'status', 'created_by', 'created_at', 'modified_by', 'modified_at'
        ]
        read_only_fields = ['id','created_by', 'created_at', 'modified_by', 'modified_at', 'status', 'dimension']

    def get_modified_by(self, obj):
        return obj.modified_by.get_full_name if obj.modified_by else None

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            user = request.user
            validated_data['created_by'] = user
            if user.dimension:
                validated_data['dimension'] = user.dimension
            else:
                raise serializers.ValidationError({"dimension": "User is not mapped to a dimension(division or department)"})
        
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        " Set record modifier "
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['modified_by'] = request.user
        return super().update(instance, validated_data)
    
class InitiativeActionSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.get_full_name')
    modified_by = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(format="%b %d, %Y %I:%M %p", read_only=True)
    modified_at = serializers.DateTimeField(format="%b %d, %Y %I:%M %p", read_only=True)

    class Meta:
        model = InitiativeAction
        fields = [
            'id', 'initiative', 'cummulative_actual', 'action_description', 'action_factor', 'raw_score', 'weighted_score', 'weighted_achieved',
            'created_by', 'created_at', 'modified_by', 'modified_at'
        ]
        read_only_fields = ['id','created_by', 'created_at', 'modified_by', 'modified_at']

    def validate(self, attrs):
        initiative = attrs.get("initiative") or getattr(self.instance, "initiative", None)
        if initiative and initiative.status.code != "APPROVED":
            raise serializers.ValidationError("You can only add or update initiative actions for approved initiatives.")
        return super().validate(attrs)

    def get_modified_by(self, obj):
        return obj.modified_by.get_full_name if obj.modified_by else None

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['created_by'] = request.user
        
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        " Set record modifier "
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['modified_by'] = request.user
        return super().update(instance, validated_data)
    
class ApprovalStatusSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.get_full_name')
    modified_by = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(format="%b %d, %Y %I:%M %p", read_only=True)
    modified_at = serializers.DateTimeField(format="%b %d, %Y %I:%M %p", read_only=True)
    class Meta:
        model = ApprovalStatus
        fields = [
            'code', 'description', 'created_by', 'created_at', 'modified_by', 'modified_at'
        ]
        read_only_fields = ['code', 'created_by', 'created_at', 'modified_by', 'modified_at']

    def get_modified_by(self, obj):
        return obj.modified_by.get_full_name if obj.modified_by else None
    
    def update(self, instance, validated_data):
        " Set record modifier "
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['modified_by'] = request.user
        return super().update(instance, validated_data)
    
class BaseApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApprovalEntry
        fields = [
            'id', 'approver', 'actioned_at', 'status', 'comment', 'approval_entry',
            'requestor', 'requested_at', 'approver', 'actioned_at'
        ]
        read_only_fields = ['id','requestor', 'requested_at', 'approver', 'actioned_at', 'status']

    def set_status_and_user(self, validated_data, status_code, role="approver"):
        try:
            status = ApprovalStatus.objects.get(code=status_code)
        except ApprovalStatus.DoesNotExist:
            raise serializers.ValidationError(f"'{status_code}' status not defined.")

        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data[role] = request.user
            validated_data["status"] = status
        return validated_data
    
class RequestApprovalSerializer(BaseApprovalSerializer):
    def validate_approval_entry(self, value):
        if value.status.code != "OPEN":
            raise serializers.ValidationError("Only Initiatives with status 'OPEN' can be submitted for approval.")
        return value

    def create(self, validated_data):
        validated_data = self.set_status_and_user(validated_data, "PENDINGAPPROVAL", role="requestor")
        approval_entry = super().create(validated_data)

        # Update the Initiative's status
        init_instance = approval_entry.approval_entry
        try:
            pending_status = ApprovalStatus.objects.get(code="PENDINGAPPROVAL")
        except ApprovalStatus.DoesNotExist:
            raise serializers.ValidationError("'PENDINGAPPROVAL' status not defined.")

        init_instance.status = pending_status
        init_instance.save(update_fields=["status"])

        return approval_entry
    
class ApproveApprovalRequestSerializer(BaseApprovalSerializer):
    def validate_approval_entry(self, value):
        if value.status.code != "PENDINGAPPROVAL":
            raise serializers.ValidationError("Only Initiatives with status 'PENDINGAPPROVAL' can be approved.")
        return value

    def create(self, validated_data):
        validated_data = self.set_status_and_user(validated_data, "APPROVED", role="approver")
        approval_entry = super().create(validated_data)


        init_instance = approval_entry.approval_entry
        try:
            approved_status = ApprovalStatus.objects.get(code="APPROVED")
        except ApprovalStatus.DoesNotExist:
            raise serializers.ValidationError("'APPROVED' status not defined.")

        init_instance.status = approved_status
        init_instance.save(update_fields=["status"])

        return approval_entry
    
class RejectApprovalRequestSerializer(BaseApprovalSerializer):
    def validate_approval_entry(self, value):
        if value.status.code != "PENDINGAPPROVAL":
            raise serializers.ValidationError("Only Initiatives with status 'PENDINGAPPROVAL' can be rejected.")
        return value

    def create(self, validated_data):
        validated_data = self.set_status_and_user(validated_data, "REJECTED", role="approver")
        approval_entry = super().create(validated_data)


        init_instance = approval_entry.approval_entry
        try:
            open_status = ApprovalStatus.objects.get(code="OPEN")
        except ApprovalStatus.DoesNotExist:
            raise serializers.ValidationError("'OPEN' status not defined.")

        init_instance.status = open_status
        init_instance.save(update_fields=["status"])

        return approval_entry
    
class CancelApprovalRequestSerializer(BaseApprovalSerializer):
    def validate_approval_entry(self, value):
        if value.status.code != "PENDINGAPPROVAL":
            raise serializers.ValidationError("Only Initiatives with status 'PENDINGAPPROVAL' can be cancelled.")
        return value

    def create(self, validated_data):
        validated_data = self.set_status_and_user(validated_data, "CANCELLED", role="approver")
        approval_entry = super().create(validated_data)


        init_instance = approval_entry.approval_entry
        try:
            open_status = ApprovalStatus.objects.get(code="OPEN")
        except ApprovalStatus.DoesNotExist:
            raise serializers.ValidationError("'OPEN' status not defined.")

        init_instance.status = open_status
        init_instance.save(update_fields=["status"])

        return approval_entry
