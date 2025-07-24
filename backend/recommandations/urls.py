from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RecommandationViewSet

router = DefaultRouter()
router.register(r'recommandations', RecommandationViewSet, basename='recommandation')

urlpatterns = [
    path('api/', include(router.urls)),
]

