from django.http import HttpResponse, JsonResponse
from django.db import connection

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
