from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models_strategic_objectives import StrategicObjective, KeyMetric, ActionItem
from .models_department import Branch
from .serializers_strategic import (
    StrategicObjectiveSerializer, 
    KeyMetricSerializer, 
    ActionItemSerializer,
    DepartmentStrategicDataSerializer
)

@api_view(['GET'])
def department_strategic_overview(request, department_name):
    """Get all strategic data for a specific department"""
    try:
        # Get the branch/department
        branch = get_object_or_404(Branch, name__iexact=department_name)
        
        # Get all related data
        objectives = StrategicObjective.objects.filter(branch=branch, is_active=True)
        key_metrics = KeyMetric.objects.filter(branch=branch, is_active=True)
        priority_actions = ActionItem.objects.filter(
            branch=branch, 
            action_type='priority', 
            is_active=True
        )
        recent_achievements = ActionItem.objects.filter(
            branch=branch, 
            action_type='achievement', 
            is_active=True
        )
        
        # Serialize the data
        data = {
            'department_info': {
                'id': branch.id,
                'name': branch.name,
                'head': branch.head
            },
            'objectives': StrategicObjectiveSerializer(objectives, many=True).data,
            'key_metrics': KeyMetricSerializer(key_metrics, many=True).data,
            'priority_actions': ActionItemSerializer(priority_actions, many=True).data,
            'recent_achievements': ActionItemSerializer(recent_achievements, many=True).data,
        }
        
        return Response(data, status=status.HTTP_200_OK)
        
    except Branch.DoesNotExist:
        return Response(
            {'error': f'Department "{department_name}" not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class StrategicObjectiveListView(generics.ListCreateAPIView):
    serializer_class = StrategicObjectiveSerializer
    
    def get_queryset(self):
        department = self.request.query_params.get('department', None)
        queryset = StrategicObjective.objects.filter(is_active=True)
        
        if department:
            queryset = queryset.filter(branch__name__iexact=department)
            
        return queryset

class StrategicObjectiveDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = StrategicObjective.objects.all()
    serializer_class = StrategicObjectiveSerializer

class KeyMetricListView(generics.ListCreateAPIView):
    serializer_class = KeyMetricSerializer
    
    def get_queryset(self):
        department = self.request.query_params.get('department', None)
        queryset = KeyMetric.objects.filter(is_active=True)
        
        if department:
            queryset = queryset.filter(branch__name__iexact=department)
            
        return queryset

class ActionItemListView(generics.ListCreateAPIView):
    serializer_class = ActionItemSerializer
    
    def get_queryset(self):
        department = self.request.query_params.get('department', None)
        action_type = self.request.query_params.get('type', None)
        queryset = ActionItem.objects.filter(is_active=True)
        
        if department:
            queryset = queryset.filter(branch__name__iexact=department)
        
        if action_type:
            queryset = queryset.filter(action_type=action_type)
            
        return queryset

@api_view(['GET'])
def departments_list(request):
    """Get list of all departments/branches"""
    branches = Branch.objects.all()
    data = [{'id': branch.id, 'name': branch.name, 'head': branch.head} for branch in branches]
    return Response(data, status=status.HTTP_200_OK)
