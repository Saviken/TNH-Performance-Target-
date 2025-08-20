from django.http import HttpResponse, JsonResponse
from django.db import connection

def home(request):
    return HttpResponse("<h1>Welcome to the Hospital Dashboard Home Page</h1>")

def health(request):
    try:
        with connection.cursor() as cur:
            cur.execute("SELECT 1")
        db_ok = True
    except Exception:
        db_ok = False
    return JsonResponse({
        'status': 'ok' if db_ok else 'degraded',
        'db': db_ok,
    })
