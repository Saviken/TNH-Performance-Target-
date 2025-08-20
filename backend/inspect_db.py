import os, sys, django, traceback
os.environ.setdefault('DJANGO_SETTINGS_MODULE','core.settings')
try:
    django.setup()
    from django.conf import settings
    print('ENGINE:', settings.DATABASES['default']['ENGINE'])
    from django.db import connection
    with connection.cursor() as cur:
        cur.execute("SELECT app, name FROM django_migrations WHERE app='posts' ORDER BY name;")
        rows = cur.fetchall()
        print('Applied posts migrations:')
        for row in rows:
            print('  -', row[1])
        cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name='posts_performanceobjective' ORDER BY ordinal_position;")
        cols = [r[0] for r in cur.fetchall()]
        print('\nPerformanceObjective columns:', cols)
except Exception:
    print('ERROR:\n', traceback.format_exc())
sys.stdout.flush()
