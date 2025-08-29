import os
from pathlib import Path
import environ
import ldap
from django_auth_ldap.config import LDAPSearch, GroupOfNamesType, LDAPSearchUnion
import logging
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
env = environ.Env()
# Get the desired env file from ENV_FILE environment variable (fallback to .dev.env)
env_file = os.getenv("ENV_FILE", ".env")

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env("SECRET_KEY", default=None)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool("DEBUG", default=True)

ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=[])

# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders", 
    "posts",
    "authentication",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]
CSRF_TRUSTED_ORIGINS = env.list("DJANGO_CSRF_TRUSTED_ORIGINS", default=[])
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS", default=[])

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

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env("POSTGRES_DATABASE", default=None),
        "USER": env("POSTGRES_USER", default=None),
        "PASSWORD": env("POSTGRES_PASSWORD", default=None),
        "HOST": env("POSTGRES_HOST", default=None),
        "PORT": env.int("POSTGRES_PORT", default=None),
    },
}


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]
# AD Integration
#-----------------------------------------------------------
# Enable LDAP Authentication Backend
AUTHENTICATION_BACKENDS = [
    "django_auth_ldap.backend.LDAPBackend",  # LDAP authentication
    "django.contrib.auth.backends.ModelBackend",  # Default Django auth (for superusers)
]
# LDAP Server Configuration
# LDAP Server URI
AUTH_LDAP_SERVER_URI = " ".join(env.list("AUTH_LDAP_SERVER_URI", default=[]))
# Bind credentials
AUTH_LDAP_BIND_DN = env("AUTH_LDAP_BIND_DN", default=None)
AUTH_LDAP_BIND_PASSWORD = env("AUTH_LDAP_BIND_PASSWORD", default=None)
# Define the search base (OU or entire domain)
AUTH_LDAP_USER_SEARCH = LDAPSearchUnion(
    LDAPSearch("CN=Users,DC=nbihosp,DC=org", ldap.SCOPE_SUBTREE, "(sAMAccountName=%(user)s)"),  
    LDAPSearch("OU=ALL,DC=nbihosp,DC=org", ldap.SCOPE_SUBTREE, "(sAMAccountName=%(user)s)"),
) # Maps to AD usernames
# Map AD User Attributes to Django User Model
AUTH_LDAP_USER_ATTR_MAP = {
    "first_name": "givenName",
    "last_name": "sn",
    "email": "userPrincipalName",
}
# Alow creating Django user records on first login
AUTH_LDAP_ALWAYS_UPDATE_USER = True
# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Africa/Nairobi"
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

# REST Framework configuration for development
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [],
}

AUTH_USER_MODEL="authentication.User"


# Logging
LOG_DIR = os.path.join(BASE_DIR, 'logs')

if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)

# Dynamically determine log level based on environment (use DEBUG for dev, ERROR for prod)
LOG_LEVEL = 'DEBUG' if env('DEBUG', default='True') == 'True' else 'ERROR'
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
            'datefmt': '%Y-%m-%d %H:%M:%S',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        # Console handler for development
        'console': {
            'level': 'WARNING', # Removed DEBUG level
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        # File handler for production logs
        'file': {
            'level': LOG_LEVEL,
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'logs/ticket_backend.log'),
            'formatter': 'verbose',
        },
        "ldap": {
            "level": LOG_LEVEL,
            "class": "logging.StreamHandler",
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': LOG_LEVEL,
            'propagate': True,
        },
        'django.request': {
            'handlers': ['file'],  # Errors for request-related issues are logged to the file
            'level': 'ERROR',
            'propagate': False,
        },
        'django.db.backends': {
            'handlers': ['file'],  # Database queries can be logged to the file
            'level': 'ERROR',
            'propagate': False,
        },
        "django_auth_ldap": {
            "handlers": ["ldap", "file"],
            "level": LOG_LEVEL,
            "propagate": True,
        },
    },
}