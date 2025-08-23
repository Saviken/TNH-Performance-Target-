#!/bin/bash

set -o errexit
set -o pipefail
set -o nounset

postgres_ready() {
    python << END
import sys
from psycopg import connect
from psycopg.errors import OperationalError

try:
    connect(
        dbname="${POSTGRES_DATABASE}",
        user="${POSTGRES_USER}",
        password="${POSTGRES_PASSWORD}",
        host="${POSTGRES_HOST}",
        port="${POSTGRES_PORT}",
    ).close()
except OperationalError:
    sys.exit(-1)
END
}
until postgres_ready; do
  >&2 echo "Waiting for PostgreSQL to become available..."
  sleep 5
done
>&2 echo "PostgreSQL is available"

# Force loading all migrations
python3 manage.py showmigrations > /dev/null

# Only run migrations on the server service
if [[ "$1" == "/app/docker/django/start.sh" && "$2" == "backend" ]]; then
    if ! python3 manage.py makemigrations --check --dry-run | grep -q "No changes detected"; then
      echo "Detected changes in models, running makemigrations..."
      python3 manage.py makemigrations
    else
      echo "No model changes detected, skipping makemigrations."
    fi
    python3 manage.py migrate
    echo "Creating system roles"
    python3 manage.py create_roles
    if [[ "$DEBUG" == "True" ]]; then
        if [ -f "/app/db.json" ]; then
          echo "Loading dummy database..."
          python3 manage.py load_fixtures
        else
          echo "Looks like there is no dummy database or fixture to load..."
        fi
    else
      echo "This is not a drill...."
    fi
    echo "Assign super user to Admin group"
    python3 manage.py assign_admin_group
    echo "Collecting static files..."
    python3 manage.py collectstatic --noinput
fi

exec "$@"
