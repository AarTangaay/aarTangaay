from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from .models import User
from utils.enums import RoleEnum
from utils.auth import authenticate_request
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
import jwt, datetime
from django.conf import settings
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


def generate_jwt_token(user_id, email):
    """Génère un JWT simple à partir de l'ID utilisateur et l'email"""
    payload = {
        "user_id": str(user_id),
        "email": email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1),
        "iat": datetime.datetime.utcnow()
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


class RegisterView(APIView):
    @swagger_auto_schema(
        operation_description="Créer un nouvel utilisateur.\n\n"
            "Permet de créer un compte utilisateur en fournissant les informations nécessaires.",
        request_body=RegisterSerializer,
        responses={
            201: openapi.Response(
                description="Utilisateur créé avec succès",
                examples={
                    "application/json": {"message": "Utilisateur créé avec succès"}
                }
            ),
            400: openapi.Response(
                description="Erreur de validation",
                examples={
                    "application/json": {"email": ["Cet email existe déjà."]}
                }
            ),
        }
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Utilisateur créé avec succès"}, status=201)
        return Response(serializer.errors, status=400)


class LoginView(APIView):
    @swagger_auto_schema(
        operation_description="Connexion utilisateur.\n\n"
            "Permet à un utilisateur de se connecter et de recevoir un token JWT.",
        request_body=LoginSerializer,
        responses={
            200: openapi.Response(
                description="Connexion réussie, retourne le token et l'utilisateur",
                examples={
                    "application/json": {
                        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
                        "user": {
                            "id": "1",
                            "email": "user@email.com",
                            "nom": "Doe",
                            "prenom": "John"
                        }
                    }
                }
            ),
            400: openapi.Response(
                description="Identifiants invalides",
                examples={
                    "application/json": {"detail": "Identifiants invalides"}
                }
            ),
        }
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        data = serializer.validated_data
        user = User.objects(email=data["email"]).first()

        if not user or not user.check_password(data["password"]):
            raise AuthenticationFailed("Identifiants invalides")

        token = generate_jwt_token(user.user_id, user.email)
        user_data = UserSerializer(user).data

        return Response({
            "token": token,
            "user": user_data
        })


class MeView(APIView):
    @swagger_auto_schema(
        operation_description="Récupérer les informations de l'utilisateur connecté.\n\n"
            "Nécessite un token JWT valide dans l'en-tête Authorization.",
        responses={
            200: openapi.Response(
                description="Données utilisateur",
                examples={
                    "application/json": {
                        "user_id": "1",
                        "email": "user@email.com",
                        "nom": "Doe",
                        "prenom": "John"
                    }
                }
            )
        }
    )
    @authenticate_request
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)


class AdminDashboardView(APIView):
    @swagger_auto_schema(
        operation_description="Accès au dashboard admin (admin uniquement).\n\n"
            "Nécessite un token JWT d'un utilisateur ayant le rôle ADMIN.",
        responses={
            200: openapi.Response(
                description="Bienvenue sur le tableau de bord admin",
                examples={
                    "application/json": {"message": "Bienvenue sur le tableau de bord admin"}
                }
            ),
            403: openapi.Response(
                description="Accès refusé",
                examples={
                    "application/json": {"error": "Accès refusé, admin uniquement"}
                }
            ),
        }
    )
    @authenticate_request
    def get(self, request):
        if request.user.role != RoleEnum.ADMIN.name:
            return Response({"error": "Accès refusé, admin uniquement"}, status=403)

        return Response({"message": "Bienvenue sur le tableau de bord admin"})
