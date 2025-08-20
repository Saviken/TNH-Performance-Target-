
from django.urls import path, include
from .views import (
    get_posts,
    get_ict_posts,
    get_engineering_posts,
    get_finance_posts,
    get_healthscience_posts,
    get_humanresources_posts,
    get_internalaudit_posts,
    get_legalkha_posts,
    get_medicalservices_posts,
    get_nursingservices_posts,
    get_operations_posts,
    get_riskcompliance_posts,
    get_security_posts,
    get_strategyinnovation_posts,
    get_supplychain_posts,
)

from .api.urls import urlpatterns as api_urlpatterns, post_router

urlpatterns = [
    path('', get_posts, name='get_posts'),
    path('ict/', get_ict_posts, name='get_ict_posts'),
    path('engineering/', get_engineering_posts, name='get_engineering_posts'),
    path('finance/', get_finance_posts, name='get_finance_posts'),
    path('health-science/', get_healthscience_posts, name='get_healthscience_posts'),
    path('human-resources/', get_humanresources_posts, name='get_humanresources_posts'),
    path('internal-audit/', get_internalaudit_posts, name='get_internalaudit_posts'),
    path('legal-kha/', get_legalkha_posts, name='get_legalkha_posts'),
    path('medical-services/', get_medicalservices_posts, name='get_medicalservices_posts'),
    path('nursing-services/', get_nursingservices_posts, name='get_nursingservices_posts'),
    path('operations/', get_operations_posts, name='get_operations_posts'),
    path('risk-compliance/', get_riskcompliance_posts, name='get_riskcompliance_posts'),
    path('security/', get_security_posts, name='get_security_posts'),
    path('strategy-innovation/', get_strategyinnovation_posts, name='get_strategyinnovation_posts'),
    path('supply-chain/', get_supplychain_posts, name='get_supplychain_posts'),
    
    # Strategic objectives API endpoints
    path('api/strategic/', include('posts.urls_strategic')),
]

# Add API endpoints
urlpatterns += api_urlpatterns
urlpatterns += post_router.urls
