from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    branch_name = serializers.CharField(source='branch.name', read_only=True)
    subtitle_name = serializers.CharField(source='subtitle.name', read_only=True)
    criteria_name = serializers.CharField(source='criteria.name', read_only=True)
    class Meta:
        model = Post
        fields = [
            'id',
            'branch',
            'branch_name',
            'subtitle_name',
            'criteria',
            'criteria_name',
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
            'status',
            'is_locked',
        ]
