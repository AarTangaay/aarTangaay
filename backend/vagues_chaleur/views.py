from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import VagueChaleur
from .serializers import VagueChaleurSerializer
from zones_geographiques.models import ZoneGeographique
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class VagueChaleurViewSet(viewsets.ViewSet):
    @swagger_auto_schema(
        operation_description="Lister toutes les vagues de chaleur.",
        responses={200: openapi.Response(
            description="Liste des vagues de chaleur",
            examples={
                "application/json": [
                    {
                        "id": "662f1e7b8e4b0c001e8b4568",
                        "nom": "Vague intense juillet",
                        "date_debut": "2024-07-20T12:00:00Z",
                        "date_fin": "2024-07-25T12:00:00Z",
                        "temperature_max": 45.2,
                        "zone_geographique": "662f1e7b8e4b0c001e8b4567"
                    }
                ]
            }
        )}
    )
    def list(self, request):
        vagues = VagueChaleur.objects.all()
        serializer = VagueChaleurSerializer(vagues, many=True)
        return Response(serializer.data)
    
    @swagger_auto_schema(
        operation_description="Créer une nouvelle vague de chaleur.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["nom", "date_debut", "date_fin", "temperature_max", "zone_geographique"],
            properties={
                "nom": openapi.Schema(type=openapi.TYPE_STRING, description="Nom de la vague"),
                "date_debut": openapi.Schema(type=openapi.TYPE_STRING, format="date-time", description="Date de début"),
                "date_fin": openapi.Schema(type=openapi.TYPE_STRING, format="date-time", description="Date de fin"),
                "temperature_max": openapi.Schema(type=openapi.TYPE_NUMBER, format="float", description="Température maximale"),
                "zone_geographique": openapi.Schema(type=openapi.TYPE_STRING, description="ID de la zone géographique"),
            }
        ),
        responses={
            201: openapi.Response(
                description="Vague créée avec succès",
                examples={
                    "application/json": {
                        "id": "662f1e7b8e4b0c001e8b4568",
                        "nom": "Vague intense juillet",
                        "date_debut": "2024-07-20T12:00:00Z",
                        "date_fin": "2024-07-25T12:00:00Z",
                        "temperature_max": 45.2,
                        "zone_geographique": "662f1e7b8e4b0c001e8b4567"
                    }
                }
            ),
            400: openapi.Response(
                description="Erreur de validation",
                examples={"application/json": {"nom": ["Ce champ est obligatoire."]}}
            ),
        }
    )
    def create(self, request):
        serializer = VagueChaleurSerializer(data=request.data)
        if serializer.is_valid():
            vague = serializer.save()
            return Response(VagueChaleurSerializer(vague).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        operation_description="Récupérer une vague de chaleur par son ID.",
        responses={
            200: openapi.Response(
                description="Détails de la vague",
                examples={
                    "application/json": {
                        "id": "662f1e7b8e4b0c001e8b4568",
                        "nom": "Vague intense juillet",
                        "date_debut": "2024-07-20T12:00:00Z",
                        "date_fin": "2024-07-25T12:00:00Z",
                        "temperature_max": 45.2,
                        "zone_geographique": "662f1e7b8e4b0c001e8b4567"
                    }
                }
            ),
            404: openapi.Response(
                description="Vague de chaleur introuvable",
                examples={"application/json": {"error": "Vague de chaleur introuvable"}}
            ),
        }
    )
    def retrieve(self, request, pk=None):
        try:
            vague = VagueChaleur.objects.get(id=pk)
            serializer = VagueChaleurSerializer(vague)
            return Response(serializer.data)
        except VagueChaleur.DoesNotExist:
            return Response({'error': 'Vague de chaleur introuvable'}, status=status.HTTP_404_NOT_FOUND)
    
    @swagger_auto_schema(
        operation_description="Mettre à jour une vague de chaleur.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "nom": openapi.Schema(type=openapi.TYPE_STRING, description="Nom de la vague"),
                "date_debut": openapi.Schema(type=openapi.TYPE_STRING, format="date-time", description="Date de début"),
                "date_fin": openapi.Schema(type=openapi.TYPE_STRING, format="date-time", description="Date de fin"),
                "temperature_max": openapi.Schema(type=openapi.TYPE_NUMBER, format="float", description="Température maximale"),
                "zone_geographique": openapi.Schema(type=openapi.TYPE_STRING, description="ID de la zone géographique"),
            }
        ),
        responses={
            200: openapi.Response(
                description="Vague mise à jour",
                examples={
                    "application/json": {
                        "id": "662f1e7b8e4b0c001e8b4568",
                        "nom": "Vague intense juillet",
                        "date_debut": "2024-07-20T12:00:00Z",
                        "date_fin": "2024-07-26T12:00:00Z",
                        "temperature_max": 46.0,
                        "zone_geographique": "662f1e7b8e4b0c001e8b4567"
                    }
                }
            ),
            400: openapi.Response(
                description="Erreur de validation",
                examples={"application/json": {"nom": ["Ce champ est obligatoire."]}}
            ),
            404: openapi.Response(
                description="Vague de chaleur introuvable",
                examples={"application/json": {"error": "Vague de chaleur introuvable"}}
            ),
        }
    )
    def update(self, request, pk=None):
        try:
            vague = VagueChaleur.objects.get(id=pk)
            serializer = VagueChaleurSerializer(vague, data=request.data)
            if serializer.is_valid():
                vague = serializer.save()
                return Response(VagueChaleurSerializer(vague).data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except VagueChaleur.DoesNotExist:
            return Response({'error': 'Vague de chaleur introuvable'}, status=status.HTTP_404_NOT_FOUND)
    
    @swagger_auto_schema(
        operation_description="Supprimer une vague de chaleur.",
        responses={
            204: openapi.Response(description="Vague supprimée"),
            404: openapi.Response(
                description="Vague de chaleur introuvable",
                examples={"application/json": {"error": "Vague de chaleur introuvable"}}
            ),
        }
    )
    def destroy(self, request, pk=None):
        try:
            vague = VagueChaleur.objects.get(id=pk)
            vague.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except VagueChaleur.DoesNotExist:
            return Response({'error': 'Vague de chaleur introuvable'}, status=status.HTTP_404_NOT_FOUND)
    
    @swagger_auto_schema(
        operation_description="Récupérer les vagues de chaleur par zone géographique.",
        manual_parameters=[
            openapi.Parameter('zone_id', openapi.IN_QUERY, description="ID de la zone géographique", type=openapi.TYPE_STRING)
        ],
        responses={
            200: openapi.Response(
                description="Liste des vagues de chaleur pour la zone",
                examples={
                    "application/json": [
                        {
                            "id": "662f1e7b8e4b0c001e8b4568",
                            "nom": "Vague intense juillet",
                            "date_debut": "2024-07-20T12:00:00Z",
                            "date_fin": "2024-07-25T12:00:00Z",
                            "temperature_max": 45.2,
                            "zone_geographique": "662f1e7b8e4b0c001e8b4567"
                        }
                    ]
                }
            ),
            400: openapi.Response(
                description="Paramètre manquant",
                examples={"application/json": {"error": "zone_id requis en paramètre"}}
            ),
            404: openapi.Response(
                description="Zone géographique introuvable",
                examples={"application/json": {"error": "Zone géographique introuvable"}}
            ),
        }
    )
    @action(detail=False, methods=['get'])
    def par_zone(self, request):
        """Récupérer les vagues de chaleur par zone géographique"""
        zone_id = request.query_params.get('zone_id')
        
        if not zone_id:
            return Response(
                {'error': 'zone_id requis en paramètre'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            zone = ZoneGeographique.objects.get(id=zone_id)
            vagues = VagueChaleur.objects.filter(zone_geographique=zone)
            serializer = VagueChaleurSerializer(vagues, many=True)
            return Response(serializer.data)
        except ZoneGeographique.DoesNotExist:
            return Response(
                {'error': 'Zone géographique introuvable'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @swagger_auto_schema(
        operation_description="Récupérer les vagues de chaleur actuellement actives.",
        responses={
            200: openapi.Response(
                description="Liste des vagues de chaleur actives",
                examples={
                    "application/json": [
                        {
                            "id": "662f1e7b8e4b0c001e8b4568",
                            "nom": "Vague intense juillet",
                            "date_debut": "2024-07-20T12:00:00Z",
                            "date_fin": "2024-07-25T12:00:00Z",
                            "temperature_max": 45.2,
                            "zone_geographique": "662f1e7b8e4b0c001e8b4567"
                        }
                    ]
                }
            )
        }
    )
    @action(detail=False, methods=['get'])
    def actives(self, request):
        """Récupérer les vagues de chaleur actuellement actives"""
        from datetime import datetime
        maintenant = datetime.now()
        
        vagues_actives = VagueChaleur.objects.filter(
            date_debut__lte=maintenant,
            date_fin__gte=maintenant
        )
        
        serializer = VagueChaleurSerializer(vagues_actives, many=True)
        return Response(serializer.data)

