import jwt
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed
from authentification.models import User

# Middleware ou décorateur pour authentifier l'utilisateur depuis le token JWT
def authenticate_request(view_func):
    def wrapper(self, request, *args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise AuthenticationFailed("Token JWT manquant")

        token = auth_header.split(" ")[1]
        print("token", token)
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token expiré")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Token invalide")
        print("payload:", payload)

        user = User.objects(user_id=payload["user_id"]).first()
        if not user:
            raise AuthenticationFailed("Utilisateur introuvable")

        request.user = user  # Injecte manuellement l'utilisateur dans la requête
        return view_func(self, request, *args, **kwargs)
    return wrapper
