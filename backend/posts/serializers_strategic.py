from rest_framework import serializers
from .models_strategic_objectives import StrategicObjective, KeyMetric, ActionItem
from .models_department import Branch

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ['id', 'name', 'head']

class StrategicObjectiveSerializer(serializers.ModelSerializer):
    branch = BranchSerializer(read_only=True)
    color = serializers.CharField(read_only=True)

    class Meta:
        model = StrategicObjective
        fields = [
            'id', 'title', 'description', 'branch', 'progress', 
            'status', 'target', 'deadline', 'priority', 'color',
            'created_at', 'updated_at', 'is_active'
        ]

class KeyMetricSerializer(serializers.ModelSerializer):
    branch = BranchSerializer(read_only=True)

    class Meta:
        model = KeyMetric
        fields = [
            'id', 'label', 'value', 'trend', 'icon_name', 
            'branch', 'created_at', 'updated_at', 'is_active'
        ]

class ActionItemSerializer(serializers.ModelSerializer):
    branch = BranchSerializer(read_only=True)

    class Meta:
        model = ActionItem
        fields = [
            'id', 'title', 'description', 'action_type', 'due_date',
            'branch', 'icon_name', 'completed_date', 'created_at', 
            'updated_at', 'is_active'
        ]

class DepartmentStrategicDataSerializer(serializers.Serializer):
    """Combined serializer for all strategic data for a department"""
    objectives = StrategicObjectiveSerializer(many=True)
    key_metrics = KeyMetricSerializer(many=True)
    priority_actions = ActionItemSerializer(many=True)
    recent_achievements = ActionItemSerializer(many=True)
    department_info = BranchSerializer()
