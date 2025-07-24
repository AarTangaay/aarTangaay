from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Statistique
from .serializers import StatistiqueSerializer
from vagues_chaleur.models import VagueChaleur
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class StatistiqueViewSet(viewsets.ViewSet):
    @swagger_auto_schema(
        operation_description="Lister toutes les statistiques.",
        responses={200: openapi.Response(
            description="Liste des statistiques",
            examples={
                "application/json": [
                    {
                        "id": "1",
                        "nombre_vague": 3,
                        "temperature_moyenne": 41.2,
                        "vague_chaleur": "662f1e7b8e4b0c001e8b4568",
                        "created_at": "2024-07-24T12:00:00Z",
                        "updated_at": "2024-07-24T12:00:00Z"
                    }
                ]
            }
        )}
    )
    def list(self, request):
        statistiques = Statistique.objects.all()
        serializer = StatistiqueSerializer(statistiques, many=True)
        return Response(serializer.data)
    
    @swagger_auto_schema(
        operation_description="Créer une statistique.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["nombre_vague", "temperature_moyenne", "vague_chaleur"],
            properties={
                "nombre_vague": openapi.Schema(type=openapi.TYPE_INTEGER, description="Nombre de vagues de chaleur"),
                "temperature_moyenne": openapi.Schema(type=openapi.TYPE_NUMBER, format="float", description="Température moyenne"),
                "vague_chaleur": openapi.Schema(type=openapi.TYPE_STRING, description="ID de la vague de chaleur"),
            }
        ),
        responses={
            201: openapi.Response(
                description="Statistique créée",
                examples={
                    "application/json": {
                        "id": "1",
                        "nombre_vague": 3,
                        "temperature_moyenne": 41.2,
                        "vague_chaleur": "662f1e7b8e4b0c001e8b4568",
                        "created_at": "2024-07-24T12:00:00Z",
                        "updated_at": "2024-07-24T12:00:00Z"
                    }
                }
            ),
            400: openapi.Response(
                description="Erreur de validation",
                examples={"application/json": {"nombre_vague": ["Ce champ est obligatoire."]}}
            ),
        }
    )
    def create(self, request):
        serializer = StatistiqueSerializer(data=request.data)
        if serializer.is_valid():
            statistique = serializer.save()
            return Response(StatistiqueSerializer(statistique).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, pk=None):
        try:
            statistique = Statistique.objects.get(id=pk)
            serializer = StatistiqueSerializer(statistique)
            return Response(serializer.data)
        except Statistique.DoesNotExist:
            return Response({'error': 'Statistique introuvable'}, status=status.HTTP_404_NOT_FOUND)
    
    def update(self, request, pk=None):
        try:
            statistique = Statistique.objects.get(id=pk)
            serializer = StatistiqueSerializer(statistique, data=request.data)
            if serializer.is_valid():
                statistique = serializer.save()
                return Response(StatistiqueSerializer(statistique).data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Statistique.DoesNotExist:
            return Response({'error': 'Statistique introuvable'}, status=status.HTTP_404_NOT_FOUND)
    
    def destroy(self, request, pk=None):
        try:
            statistique = Statistique.objects.get(id=pk)
            statistique.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Statistique.DoesNotExist:
            return Response({'error': 'Statistique introuvable'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def par_vague(self, request):
        """Récupérer les statistiques par vague de chaleur"""
        vague_id = request.query_params.get('vague_id')
        
        if not vague_id:
            return Response(
                {'error': 'vague_id requis en paramètre'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            vague = VagueChaleur.objects.get(id=vague_id)
            statistique = Statistique.objects.filter(vague_chaleur=vague).first()
            
            if statistique:
                serializer = StatistiqueSerializer(statistique)
                return Response(serializer.data)
            else:
                return Response(
                    {'message': 'Aucune statistique trouvée pour cette vague de chaleur'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        except VagueChaleur.DoesNotExist:
            return Response(
                {'error': 'Vague de chaleur introuvable'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def resume_global(self, request):
        """Récupérer un résumé global des statistiques"""
        statistiques = Statistique.objects.all()
        
        if not statistiques:
            return Response({'message': 'Aucune statistique disponible'})
        
        # Calculer des métriques globales
        total_vagues = sum(stat.nombre_vague for stat in statistiques)
        temp_moyenne_globale = sum(stat.temperature_moyenne for stat in statistiques) / len(statistiques)
        
        return Response({
            'total_statistiques': len(statistiques),
            'total_vagues_enregistrees': total_vagues,
            'temperature_moyenne_globale': round(temp_moyenne_globale, 2)
        })

