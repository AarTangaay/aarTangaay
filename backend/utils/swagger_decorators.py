# utils/swagger_decorators.py
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

def swagger_bearer_auth(**kwargs):
    """
    Décorateur qui ajoute automatiquement l'authentification Bearer
    """
    # Ajoute la sécurité Bearer aux paramètres
    kwargs.setdefault('manual_parameters', []).append(
        openapi.Parameter(
            'Authorization',
            openapi.IN_HEADER,
            description="JWT Authorization header using the Bearer scheme. Example: Bearer {token}",
            type=openapi.TYPE_STRING,
            required=True,
        )
    )
    
    return swagger_auto_schema(**kwargs)