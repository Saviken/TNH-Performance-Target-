import os
from pathlib import Path
from decouple import config

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config(
    "DJANGO_SECRET_KEY",
    cast=str,
    default="=xo592__%#6a!^yxb+fegs#$qq@&rjvn&ngo15!ha5^wy!@q$n"
)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DJANGO_DEBUG', cast=bool, default=False)

ALLOWED_HOSTS = ["*"]

# Application definition
INSTALLED_APPS = [
    "jazzmin",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    'custom_commands',
    "rest_framework",
    "corsheaders", 
    "posts",
    # "users",  # Temporarily disabled
]

# Jazzmin custom branding and color settings
JAZZMIN_SETTINGS = {
    "site_title": "Admin",
    "site_header": "",
    "site_brand": "",
    "welcome_sign": "Welcome to the Admin Portal",
    "copyright": "",
    "primary_color": "#1976d2",
    "secondary_color": "#e0e0e0",
    "accent": "#1976d2",
    "navbar": "#1976d2",
    "navbar_small_text": False,
    "body": "#f9f9f9",
    "dark_mode_theme": None,
    "related_modal_active": "#1976d2",
    "use_google_fonts_cdn": True,
    "show_sidebar": True,
    "navigation_expanded": True,
    "custom_css": None,
    "custom_js": None,
    "site_logo": "logo-tnh.png",
    "site_logo_classes": "img-circle",
    "site_icon": "logo-tnh.png",
}

# Tailwind/DaisyUI config

if DEBUG:
    INSTALLED_APPS.insert(0, "debug_toolbar")

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

if DEBUG:
    MIDDLEWARE.insert(0, "debug_toolbar.middleware.DebugToolbarMiddleware")

INTERNAL_IPS = [
    '127.0.0.1',
]

# Only allow requests from your frontend origin
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:5174',  # Add support for port 5174
]

# For development, allow all origins (optional - less secure but easier for testing)
CORS_ALLOW_ALL_ORIGINS = True

ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"

"""Database configuration

By default we use SQLite for local development (no env vars required).
If all Postgres variables are supplied (via .env or environment) we switch
to Postgres. This prevents local management commands from hanging when
Postgres is not running.
"""

# Default: lightweight SQLite (local dev & tests)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Optional PostgreSQL override
POSTGRES_USER = config('POSTGRES_USER', default="", cast=str)
POSTGRES_PASSWORD = config('POSTGRES_PASSWORD', default="", cast=str)
POSTGRES_DB = config('POSTGRES_DB', default="", cast=str)
POSTGRES_HOST = config('POSTGRES_HOST', cast=str, default='localhost')
POSTGRES_PORT = config('POSTGRES_PORT', cast=int, default=5432)

def _valid(v: str) -> bool:
    return v not in ("", "None", None)

if all(_valid(v) for v in [POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB]):
    DATABASES['default'] = {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': POSTGRES_DB,
        'USER': POSTGRES_USER,
        'PASSWORD': POSTGRES_PASSWORD,
        'HOST': POSTGRES_HOST,
        'PORT': POSTGRES_PORT,
    }

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / 'static'

# Media files (for file uploads)
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ✅ Fix for recursion error in URL resolver
APPEND_SLASH = config('DJANGO_APPEND_SLASH', cast=bool, default=True)

# REST Framework configuration for development
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [],
}
