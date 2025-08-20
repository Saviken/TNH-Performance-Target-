from django.urls import path
from . import views_strategic

urlpatterns = [
    # Strategic objectives overview for a specific department
    path('strategic-overview/<str:department_name>/', 
         views_strategic.department_strategic_overview, 
         name='department-strategic-overview'),
    
    # Strategic objectives CRUD
    path('strategic-objectives/', 
         views_strategic.StrategicObjectiveListView.as_view(), 
         name='strategic-objectives-list'),
    path('strategic-objectives/<int:pk>/', 
         views_strategic.StrategicObjectiveDetailView.as_view(), 
         name='strategic-objectives-detail'),
    
    # Key metrics CRUD
    path('key-metrics/', 
         views_strategic.KeyMetricListView.as_view(), 
         name='key-metrics-list'),
    
    # Action items CRUD
    path('action-items/', 
         views_strategic.ActionItemListView.as_view(), 
         name='action-items-list'),
    
    # Departments list
    path('departments/', 
         views_strategic.departments_list, 
         name='departments-list'),
]
