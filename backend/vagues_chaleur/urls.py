from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VagueChaleurViewSet

router = DefaultRouter()
router.register(r'vagues-chaleur', VagueChaleurViewSet, basename='vaguechaleur')

urlpatterns = [
    path('api/', include(router.urls)),
]

