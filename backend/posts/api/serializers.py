from rest_framework import serializers
from ..models import Post, Criteria, Subtitle, PerformanceObjective, QuarterlyProgress
from posts.models_department import Branch
from posts.models import Notification

# Notification serializer
class NotificationSerializer(serializers.ModelSerializer):
    recipient = serializers.StringRelatedField()
    class Meta:
        model = Notification
        fields = ["id", "recipient", "message", "url", "is_read", "created_at"]

# Subtitle serializer
class SubtitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtitle
        fields = ['id', 'name', 'division']

class QuarterlyProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuarterlyProgress
        fields = [
            'id', 'objective', 'year', 'quarter', 'target_quarter', 'actual_quarter', 'cumulative_actual',
            'explanation', 'contributing_factors', 'raw_score', 'wtd_score', 'wtd_achievement', 'rank',
            'status', 'is_locked', 'created_at', 'updated_at'
        ]

class PerformanceObjectiveSerializer(serializers.ModelSerializer):
    quarters = QuarterlyProgressSerializer(many=True, read_only=True)
    branch = serializers.CharField(source='branch.name', read_only=True)
    subtitle = serializers.CharField(source='subtitle.name', read_only=True)
    criteria = serializers.CharField(source='criteria.name', read_only=True, default=None)
    class Meta:
        model = PerformanceObjective
        fields = [
            'id', 'branch', 'subtitle', 'criteria', 'unit_of_measure', 'weight', 'annual_target', 'description',
            'status', 'is_locked', 'rejection_comment', 'unit_of_measure_status', 'created_at', 'updated_at', 'quarters'
        ]


# Nested serializer for criteria
class CriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Criteria
        fields = ['id', 'name', 'description']

class PostSerializer(serializers.ModelSerializer):
    criteria = serializers.CharField(source='criteria.name', read_only=True)
    subtitle = serializers.CharField(source='subtitle.name', read_only=True)
    
    class Meta:
        model = Post
        fields = [
            'id',
            'branch',
            'subtitle',
            'criteria',
            'unit_of_measure',
            'weight',
            'status_yr_2024',
            'annual_target',
            'cummulative_target',
            'cummulative_actual',
            'statistical_explanation',
            'factors_contributing',
            'raw_score',
            'wtd_score',
            'wtd_achievement',
            'rank',
            'status_of_activities',
            'attachment',
            'status',
            'is_locked',
        ]


# Branch serializer for hierarchical structure
class BranchSerializer(serializers.ModelSerializer):
    parent = serializers.StringRelatedField()
    class Meta:
        model = Branch
        fields = ['id', 'name', 'head', 'parent']
