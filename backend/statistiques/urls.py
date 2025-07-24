from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StatistiqueViewSet

router = DefaultRouter()
router.register(r'statistiques', StatistiqueViewSet, basename='statistique')

urlpatterns = [
    path('api/', include(router.urls)),
]

