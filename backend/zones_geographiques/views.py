from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import ZoneGeographique
from .serializers import ZoneGeographiqueSerializer
from authentification.models import User

class ZoneGeographiqueViewSet(viewsets.ViewSet):
    @swagger_auto_schema(
        operation_description="Lister toutes les zones géographiques.",
        responses={200: openapi.Response(
            description="Liste des zones géographiques",
            examples={
                "application/json": [
                    {
                        "id": "662f1e7b8e4b0c001e8b4567",
                        "ville": "Dakar",
                        "rue": "Avenue Cheikh Anta Diop",
                        "numero": 12,
                        "latitude": "14.6928",
                        "longitude": "-17.4467",
                        "rayon": 1.5,
                        "habitants": [],
                        "created_at": "2024-07-24T12:00:00Z",
                        "updated_at": "2024-07-24T12:00:00Z"
                    }
                ]
            }
        )}
    )
    def list(self, request):
        zones = ZoneGeographique.objects.all()
        serializer = ZoneGeographiqueSerializer(zones, many=True)
        return Response(serializer.data)
    
    @swagger_auto_schema(
        operation_description="Créer une nouvelle zone géographique.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["ville", "rue", "numero", "latitude", "longitude", "rayon"],
            properties={
                "ville": openapi.Schema(type=openapi.TYPE_STRING, description="Nom de la ville"),
                "rue": openapi.Schema(type=openapi.TYPE_STRING, description="Nom de la rue"),
                "numero": openapi.Schema(type=openapi.TYPE_INTEGER, description="Numéro de la rue"),
                "latitude": openapi.Schema(type=openapi.TYPE_STRING, description="Latitude"),
                "longitude": openapi.Schema(type=openapi.TYPE_STRING, description="Longitude"),
                "rayon": openapi.Schema(type=openapi.TYPE_NUMBER, format="float", description="Rayon en km"),
                "habitants": openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_STRING), description="Liste des IDs utilisateurs"),
            }
        ),
        responses={
            201: openapi.Response(
                description="Zone créée avec succès",
                examples={
                    "application/json": {
                        "id": "662f1e7b8e4b0c001e8b4567",
                        "ville": "Dakar",
                        "rue": "Avenue Cheikh Anta Diop",
                        "numero": 12,
                        "latitude": "14.6928",
                        "longitude": "-17.4467",
                        "rayon": 1.5,
                        "habitants": [],
                        "created_at": "2024-07-24T12:00:00Z",
                        "updated_at": "2024-07-24T12:00:00Z"
                    }
                }
            ),
            400: openapi.Response(
                description="Erreur de validation",
                examples={"application/json": {"ville": ["Ce champ est obligatoire."]}}
            ),
        }
    )
    def create(self, request):
        serializer = ZoneGeographiqueSerializer(data=request.data)
        if serializer.is_valid():
            zone = serializer.save()
            return Response(ZoneGeographiqueSerializer(zone).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        operation_description="Récupérer une zone géographique par son ID.",
        responses={
            200: openapi.Response(
                description="Détails de la zone",
                examples={
                    "application/json": {
                        "id": "662f1e7b8e4b0c001e8b4567",
                        "ville": "Dakar",
                        "rue": "Avenue Cheikh Anta Diop",
                        "numero": 12,
                        "latitude": "14.6928",
                        "longitude": "-17.4467",
                        "rayon": 1.5,
                        "habitants": [],
                        "created_at": "2024-07-24T12:00:00Z",
                        "updated_at": "2024-07-24T12:00:00Z"
                    }
                }
            ),
            404: openapi.Response(
                description="Zone géographique introuvable",
                examples={"application/json": {"error": "Zone géographique introuvable"}}
            ),
        }
    )
    def retrieve(self, request, pk=None):
        try:
            zone = ZoneGeographique.objects.get(id=pk)
            serializer = ZoneGeographiqueSerializer(zone)
            return Response(serializer.data)
        except ZoneGeographique.DoesNotExist:
            return Response({'error': 'Zone géographique introuvable'}, status=status.HTTP_404_NOT_FOUND)
    
    @swagger_auto_schema(
        operation_description="Mettre à jour une zone géographique.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "ville": openapi.Schema(type=openapi.TYPE_STRING, description="Nom de la ville"),
                "rue": openapi.Schema(type=openapi.TYPE_STRING, description="Nom de la rue"),
                "numero": openapi.Schema(type=openapi.TYPE_INTEGER, description="Numéro de la rue"),
                "latitude": openapi.Schema(type=openapi.TYPE_STRING, description="Latitude"),
                "longitude": openapi.Schema(type=openapi.TYPE_STRING, description="Longitude"),
                "rayon": openapi.Schema(type=openapi.TYPE_NUMBER, format="float", description="Rayon en km"),
                "habitants": openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_STRING), description="Liste des IDs utilisateurs"),
            }
        ),
        responses={
            200: openapi.Response(
                description="Zone mise à jour",
                examples={
                    "application/json": {
                        "id": "662f1e7b8e4b0c001e8b4567",
                        "ville": "Dakar",
                        "rue": "Avenue Cheikh Anta Diop",
                        "numero": 15,
                        "latitude": "14.6928",
                        "longitude": "-17.4467",
                        "rayon": 2.0,
                        "habitants": [],
                        "created_at": "2024-07-24T12:00:00Z",
                        "updated_at": "2024-07-24T13:00:00Z"
                    }
                }
            ),
            400: openapi.Response(
                description="Erreur de validation",
                examples={"application/json": {"ville": ["Ce champ est obligatoire."]}}
            ),
            404: openapi.Response(
                description="Zone géographique introuvable",
                examples={"application/json": {"error": "Zone géographique introuvable"}}
            ),
        }
    )
    def update(self, request, pk=None):
        try:
            zone = ZoneGeographique.objects.get(id=pk)
            serializer = ZoneGeographiqueSerializer(zone, data=request.data)
            if serializer.is_valid():
                zone = serializer.save()
                return Response(ZoneGeographiqueSerializer(zone).data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ZoneGeographique.DoesNotExist:
            return Response({'error': 'Zone géographique introuvable'}, status=status.HTTP_404_NOT_FOUND)
    
    @swagger_auto_schema(
        operation_description="Supprimer une zone géographique.",
        responses={
            204: openapi.Response(description="Zone supprimée"),
            404: openapi.Response(
                description="Zone géographique introuvable",
                examples={"application/json": {"error": "Zone géographique introuvable"}}
            ),
        }
    )
    def destroy(self, request, pk=None):
        try:
            zone = ZoneGeographique.objects.get(id=pk)
            zone.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ZoneGeographique.DoesNotExist:
            return Response({'error': 'Zone géographique introuvable'}, status=status.HTTP_404_NOT_FOUND)
    
    @swagger_auto_schema(
        operation_description="Ajouter un habitant à une zone géographique.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["utilisateur_id"],
            properties={
                "utilisateur_id": openapi.Schema(type=openapi.TYPE_STRING, description="ID de l'utilisateur à ajouter")
            }
        ),
        responses={
            200: openapi.Response(
                description="Habitant ajouté avec succès",
                examples={"application/json": {"message": "Habitant ajouté avec succès"}}
            ),
            400: openapi.Response(
                description="Erreur de validation",
                examples={"application/json": {"error": "utilisateur_id requis"}}
            ),
            404: openapi.Response(
                description="Zone ou utilisateur introuvable",
                examples={"application/json": {"error": "Zone géographique introuvable"}}
            ),
        }
    )
    @action(detail=True, methods=['post'])
    def ajouter_habitant(self, request, pk=None):
        """Ajouter un habitant à une zone géographique"""
        try:
            zone = ZoneGeographique.objects.get(id=pk)
        except ZoneGeographique.DoesNotExist:
            return Response({'error': 'Zone géographique introuvable'}, status=status.HTTP_404_NOT_FOUND)
            
        utilisateur_id = request.data.get('utilisateur_id')
        
        if not utilisateur_id:
            return Response(
                {'error': 'utilisateur_id requis'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            utilisateur = User.objects.get(id=utilisateur_id)
            if utilisateur not in zone.habitants:
                zone.habitants.append(utilisateur)
                zone.save()
                return Response({'message': 'Habitant ajouté avec succès'})
            else:
                return Response(
                    {'message': 'Utilisateur déjà habitant de cette zone'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        except User.DoesNotExist:
            return Response(
                {'error': 'Utilisateur introuvable'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @swagger_auto_schema(
        operation_description="Retirer un habitant d'une zone géographique.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["utilisateur_id"],
            properties={
                "utilisateur_id": openapi.Schema(type=openapi.TYPE_STRING, description="ID de l'utilisateur à retirer")
            }
        ),
        responses={
            200: openapi.Response(
                description="Habitant retiré avec succès",
                examples={"application/json": {"message": "Habitant retiré avec succès"}}
            ),
            400: openapi.Response(
                description="Erreur de validation",
                examples={"application/json": {"error": "utilisateur_id requis"}}
            ),
            404: openapi.Response(
                description="Zone ou utilisateur introuvable",
                examples={"application/json": {"error": "Zone géographique introuvable"}}
            ),
        }
    )
    @action(detail=True, methods=['delete'])
    def retirer_habitant(self, request, pk=None):
        """Retirer un habitant d'une zone géographique"""
        try:
            zone = ZoneGeographique.objects.get(id=pk)
        except ZoneGeographique.DoesNotExist:
            return Response({'error': 'Zone géographique introuvable'}, status=status.HTTP_404_NOT_FOUND)
            
        utilisateur_id = request.data.get('utilisateur_id')
        
        if not utilisateur_id:
            return Response(
                {'error': 'utilisateur_id requis'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            utilisateur = User.objects.get(id=utilisateur_id)
            if utilisateur in zone.habitants:
                zone.habitants.remove(utilisateur)
                zone.save()
                return Response({'message': 'Habitant retiré avec succès'})
            else:
                return Response(
                    {'message': 'Utilisateur n\'est pas habitant de cette zone'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        except User.DoesNotExist:
            return Response(
                {'error': 'Utilisateur introuvable'}, 
                status=status.HTTP_404_NOT_FOUND
            )

