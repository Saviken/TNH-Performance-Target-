from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

# Mock users data for testing
MOCK_USERS = [
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
    },
    {
        'id': 2,
        'username': 'finance@hospital.com',
        'email': 'finance@hospital.com',
        'name': 'Finance Manager',
        'role': 'HEAD_OF_DEPARTMENT',
        'department': 'FINANCE',
        'branch': 'Finance Department',
        'is_active': True,
        'created_at': '2024-01-15T00:00:00Z',
        'last_login': '2024-08-17T14:20:00Z'
    },
    {
        'id': 3,
        'username': 'ceo@hospital.com',
        'email': 'ceo@hospital.com',
        'name': 'Chief Executive Officer',
        'role': 'CEO',
        'department': 'EXECUTIVE',
        'branch': None,
        'is_active': True,
        'created_at': '2024-01-01T00:00:00Z',
        'last_login': '2024-08-18T09:15:00Z'
    },
    {
        'id': 4,
        'username': 'instructor@hospital.com',
        'email': 'instructor@hospital.com',
        'name': 'Medical Services Instructor',
        'role': 'INSTRUCTOR',
        'department': 'MEDICAL_SERVICES',
        'branch': 'Medical Services Department',
        'is_active': True,
        'created_at': '2024-02-01T00:00:00Z',
        'last_login': '2024-08-18T08:45:00Z'
    }
]

# Simple test endpoint
@csrf_exempt
def test_endpoint(request):
    """Simple test endpoint to verify basic functionality"""
    return JsonResponse({'status': 'success', 'message': 'Test endpoint working'})

@csrf_exempt
def users_list(request):
    """Mock API endpoint for user management"""
    print(f"Users endpoint called with method: {request.method}")
    print(f"Request user: {request.user}")
    print(f"Request META: {request.META.get('HTTP_AUTHORIZATION', 'No auth header')}")
    
    if request.method == 'GET':
        return JsonResponse({'results': MOCK_USERS})
    elif request.method == 'POST':
        try:
            # Parse JSON data from request body
            data = json.loads(request.body.decode('utf-8'))
            print(f"Received POST data: {data}")
            
            # Mock creating a new user
            new_user = {
                'id': len(MOCK_USERS) + 1,
                'username': data.get('username', 'new@hospital.com'),
                'email': data.get('email', 'new@hospital.com'),
                'name': data.get('name', 'New User'),
                'role': data.get('role', 'INSTRUCTOR'),
                'department': data.get('department', 'MEDICAL_SERVICES'),
                'branch': data.get('branch', 'Medical Services'),
                'is_active': True,
                'created_at': '2024-08-18T12:00:00Z',
                'last_login': None
            }
            MOCK_USERS.append(new_user)
            print(f"Created new user: {new_user}")
            return JsonResponse(new_user, status=201)
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            print(f"General error: {e}")
            return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def current_user(request):
    """Mock current user endpoint"""
    return JsonResponse(MOCK_USERS[0])  # Return admin user
