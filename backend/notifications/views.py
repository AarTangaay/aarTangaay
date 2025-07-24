from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Notification
from .serializers import NotificationSerializer
from authentification.models import User
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class NotificationViewSet(viewsets.ViewSet):
    @swagger_auto_schema(
        operation_description="Lister toutes les notifications.",
        responses={200: openapi.Response(
            description="Liste des notifications",
            examples={
                "application/json": [
                    {
                        "id": "1",
                        "libelle": "Alerte canicule",
                        "type": "ALERTE",
                        "date_envoi": "2024-07-24T12:00:00Z",
                        "lue": False,
                        "utilisateur": "662f1e7b8e4b0c001e8b4569",
                        "vague_chaleur": "662f1e7b8e4b0c001e8b4568",
                        "created_at": "2024-07-24T12:00:00Z",
                        "updated_at": "2024-07-24T12:00:00Z"
                    }
                ]
            }
        )}
    )
    def list(self, request):
        notifications = Notification.objects.all()
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)
    
    @swagger_auto_schema(
        operation_description="Créer une notification.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["libelle", "type", "date_envoi", "utilisateur", "vague_chaleur"],
            properties={
                "libelle": openapi.Schema(type=openapi.TYPE_STRING, description="Texte de la notification"),
                "type": openapi.Schema(type=openapi.TYPE_STRING, description="Type de notification"),
                "date_envoi": openapi.Schema(type=openapi.TYPE_STRING, format="date-time", description="Date d'envoi"),
                "utilisateur": openapi.Schema(type=openapi.TYPE_STRING, description="ID de l'utilisateur concerné"),
                "vague_chaleur": openapi.Schema(type=openapi.TYPE_STRING, description="ID de la vague de chaleur concernée"),
            }
        ),
        responses={
            201: openapi.Response(
                description="Notification créée",
                examples={
                    "application/json": {
                        "id": "1",
                        "libelle": "Alerte canicule",
                        "type": "ALERTE",
                        "date_envoi": "2024-07-24T12:00:00Z",
                        "lue": False,
                        "utilisateur": "662f1e7b8e4b0c001e8b4569",
                        "vague_chaleur": "662f1e7b8e4b0c001e8b4568",
                        "created_at": "2024-07-24T12:00:00Z",
                        "updated_at": "2024-07-24T12:00:00Z"
                    }
                }
            ),
            400: openapi.Response(
                description="Erreur de validation",
                examples={"application/json": {"libelle": ["Ce champ est obligatoire."]}}
            ),
        }
    )
    def create(self, request):
        serializer = NotificationSerializer(data=request.data)
        if serializer.is_valid():
            notification = serializer.save()
            return Response(NotificationSerializer(notification).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, pk=None):
        try:
            notification = Notification.objects.get(id=pk)
            serializer = NotificationSerializer(notification)
            return Response(serializer.data)
        except Notification.DoesNotExist:
            return Response({'error': 'Notification introuvable'}, status=status.HTTP_404_NOT_FOUND)
    
    def update(self, request, pk=None):
        try:
            notification = Notification.objects.get(id=pk)
            serializer = NotificationSerializer(notification, data=request.data)
            if serializer.is_valid():
                notification = serializer.save()
                return Response(NotificationSerializer(notification).data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Notification.DoesNotExist:
            return Response({'error': 'Notification introuvable'}, status=status.HTTP_404_NOT_FOUND)
    
    def destroy(self, request, pk=None):
        try:
            notification = Notification.objects.get(id=pk)
            notification.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Notification.DoesNotExist:
            return Response({'error': 'Notification introuvable'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def par_utilisateur(self, request):
        """Récupérer les notifications d'un utilisateur"""
        utilisateur_id = request.query_params.get('utilisateur_id')
        
        if not utilisateur_id:
            return Response(
                {'error': 'utilisateur_id requis en paramètre'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            utilisateur = User.objects.get(id=utilisateur_id)
            notifications = Notification.objects.filter(utilisateur=utilisateur)
            serializer = NotificationSerializer(notifications, many=True)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response(
                {'error': 'Utilisateur introuvable'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def non_lues(self, request):
        """Récupérer les notifications non lues d'un utilisateur"""
        utilisateur_id = request.query_params.get('utilisateur_id')
        
        if not utilisateur_id:
            return Response(
                {'error': 'utilisateur_id requis en paramètre'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            utilisateur = User.objects.get(id=utilisateur_id)
            notifications = Notification.objects.filter(
                utilisateur=utilisateur, 
                lue=False
            )
            serializer = NotificationSerializer(notifications, many=True)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response(
                {'error': 'Utilisateur introuvable'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['patch'])
    def marquer_comme_lue(self, request, pk=None):
        """Marquer une notification comme lue"""
        try:
            notification = Notification.objects.get(id=pk)
            notification.lue = True
            notification.save()
            
            serializer = NotificationSerializer(notification)
            return Response(serializer.data)
        except Notification.DoesNotExist:
            return Response({'error': 'Notification introuvable'}, status=status.HTTP_404_NOT_FOUND)

