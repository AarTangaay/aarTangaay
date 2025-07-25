from django.urls import path
from .views import RegisterView, LoginView, MeView

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("me/", MeView.as_view()),
]
