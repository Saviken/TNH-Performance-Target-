from rest_framework.routers import DefaultRouter
from posts.api.urls import post_router
from django.urls import path, include
from django.http import JsonResponse

# Mock notifications endpoint
def notifications_list(request):
    """Mock notifications for testing"""
    mock_notifications = [
        {
            'id': 1,
            'title': 'Strategic Objective Pending Approval',
            'message': 'Medical Services strategic objective requires your approval',
            'type': 'approval_request',
            'is_read': False,
            'created_at': '2024-08-18T10:30:00Z',
            'related_url': '/pages/medical-services'
        },
        {
            'id': 2,
            'title': 'Unit of Measure Approved',
            'message': 'Your unit of measure has been approved by the Head of Department',
            'type': 'approval_granted',
            'is_read': False,
            'created_at': '2024-08-18T09:15:00Z',
            'related_url': '/pages/medical-services'
        }
    ]
    return JsonResponse(mock_notifications, safe=False)

# Mock users endpoint
def users_list(request):
    """Mock users API endpoint"""
    mock_users = [
        {
            'id': 1,
            'username': 'admin@hospital.com',
            'email': 'admin@hospital.com',
            'name': 'System Administrator',
            'role': 'ADMIN',
            'department': 'ADMIN',
            'branch': None,
            'is_active': True,
            'created_at': '2024-01-01T00:00:00Z',
            'last_login': '2024-08-18T10:30:00Z'
        }
    ]
    return JsonResponse({'results': mock_users})

def current_user(request):
    """Mock current user endpoint"""
    return JsonResponse({
        'id': 1,
        'username': 'admin@hospital.com',
        'role': 'ADMIN',
        'name': 'System Administrator',
        'department': 'ADMIN',
        'branch': None,
        'is_active': True
    })

router = DefaultRouter()
#posts
router.registry.extend(post_router.registry)

urlpatterns = [
    path('', include(router.urls)),
    path('notifications/', notifications_list, name='notifications-list'),
    path('auth/users/', users_list, name='users-list'),
    path('auth/current/', current_user, name='current-user'),
]


