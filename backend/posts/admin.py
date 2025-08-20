
from django.contrib import admin
from .models import Post, Subtitle, Criteria, PerformanceObjective, QuarterlyProgress, Notification
# Notification admin
@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("id", "recipient", "message", "url", "is_read", "created_at")
    list_filter = ("recipient", "is_read")
    search_fields = ("message", "url")
from .models_strategic_objectives import StrategicObjective, StrategicCriteria, KeyMetric, ActionItem

# Criteria admin
@admin.register(Criteria)
class CriteriaAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description')
    search_fields = ('name', 'description')

from .models_department import Branch

class PostInline(admin.TabularInline):
    model = Post
    extra = 0

class SubtitleInline(admin.TabularInline):
    model = Subtitle
    extra = 0

class StrategicCriteriaInline(admin.TabularInline):
    model = StrategicCriteria
    extra = 0

class StrategicObjectiveInline(admin.TabularInline):
    model = StrategicObjective
    extra = 0

class KeyMetricInline(admin.TabularInline):
    model = KeyMetric
    extra = 0

class ActionItemInline(admin.TabularInline):
    model = ActionItem
    extra = 0

@admin.register(Subtitle)
class SubtitleAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'division')
    list_editable = ('name', 'division')
    search_fields = ('name',)
    inlines = [PostInline]

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'branch', 'subtitle', 'criteria', 'unit_of_measure', 'weight',
        'status_yr_2024', 'annual_target', 'cummulative_target', 'cummulative_actual',
        'statistical_explanation', 'factors_contributing', 'raw_score', 'wtd_score',
        'wtd_achievement', 'rank', 'status_of_activities'
    )
    list_editable = (
        'branch', 'subtitle', 'criteria', 'unit_of_measure', 'weight',
        'status_yr_2024', 'annual_target', 'cummulative_target', 'cummulative_actual',
        'statistical_explanation', 'factors_contributing', 'raw_score', 'wtd_score',
        'wtd_achievement', 'rank', 'status_of_activities'
    )
    search_fields = ('branch', 'criteria', 'subtitle__name', 'rank')

@admin.register(PerformanceObjective)
class PerformanceObjectiveAdmin(admin.ModelAdmin):
    list_display = ('id','branch','subtitle','criteria','unit_of_measure','status','is_locked','created_at')
    list_filter = ('status','branch','subtitle','criteria','is_locked')
    search_fields = ('branch__name','subtitle__name','criteria__name','unit_of_measure')
    readonly_fields = ('created_at','updated_at')

@admin.register(QuarterlyProgress)
class QuarterlyProgressAdmin(admin.ModelAdmin):
    list_display = ('id','objective','year','quarter','raw_score','cumulative_actual','status','is_locked')
    list_filter = ('year','quarter','status','is_locked')
    search_fields = ('objective__subtitle__name','objective__criteria__name')
    readonly_fields = ('created_at','updated_at')

# Branch admin for hierarchical structure
@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'head', 'parent')
    list_editable = ('name', 'head', 'parent')
    search_fields = ('name', 'head', 'parent__name')
    inlines = [SubtitleInline, PostInline, StrategicObjectiveInline, KeyMetricInline, ActionItemInline]

    def has_change_permission(self, request, obj=None):
        return True

# Strategic Objectives Admin
@admin.register(StrategicObjective)
class StrategicObjectiveAdmin(admin.ModelAdmin):
    list_display = ('title', 'branch', 'progress', 'status', 'target', 'deadline', 'priority', 'criteria_count', 'objectives_count', 'is_active')
    list_editable = ('progress', 'status', 'priority', 'criteria_count', 'objectives_count', 'is_active')
    list_filter = ('branch', 'status', 'priority', 'is_active')
    search_fields = ('title', 'description', 'branch__name')
    ordering = ['-priority', '-progress']
    inlines = [StrategicCriteriaInline]

@admin.register(StrategicCriteria)
class StrategicCriteriaAdmin(admin.ModelAdmin):
    list_display = ('title', 'strategic_objective', 'weight', 'target_value', 'actual_value', 'is_active')
    list_editable = ('weight', 'target_value', 'actual_value', 'is_active')
    list_filter = ('strategic_objective__branch', 'is_active')
    search_fields = ('title', 'description', 'strategic_objective__title')

@admin.register(KeyMetric)
class KeyMetricAdmin(admin.ModelAdmin):
    list_display = ('label', 'value', 'trend', 'branch', 'icon_name', 'is_active')
    list_editable = ('value', 'trend', 'icon_name', 'is_active')
    list_filter = ('branch', 'is_active')
    search_fields = ('label', 'branch__name')

@admin.register(ActionItem)
class ActionItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'branch', 'action_type', 'due_date', 'completed_date', 'is_active')
    list_editable = ('action_type', 'due_date', 'completed_date', 'is_active')
    list_filter = ('branch', 'action_type', 'is_active')
    search_fields = ('title', 'description', 'branch__name')
    ordering = ['-created_at']