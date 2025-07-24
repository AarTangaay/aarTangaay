from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ZoneGeographiqueViewSet

router = DefaultRouter()
router.register(r'zones-geographiques', ZoneGeographiqueViewSet, basename='zonegeographique')

urlpatterns = [
    path('', include(router.urls)),
]

