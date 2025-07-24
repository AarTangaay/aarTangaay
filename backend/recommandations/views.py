from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Recommandation
from .serializers import RecommandationSerializer
from zones_geographiques.models import ZoneGeographique

class RecommandationViewSet(viewsets.ViewSet):
    def list(self, request):
        recommandations = Recommandation.objects.all()
        serializer = RecommandationSerializer(recommandations, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        serializer = RecommandationSerializer(data=request.data)
        if serializer.is_valid():
            recommandation = serializer.save()
            return Response(RecommandationSerializer(recommandation).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, pk=None):
        try:
            recommandation = Recommandation.objects.get(id=pk)
            serializer = RecommandationSerializer(recommandation)
            return Response(serializer.data)
        except Recommandation.DoesNotExist:
            return Response({'error': 'Recommandation introuvable'}, status=status.HTTP_404_NOT_FOUND)
    
    def update(self, request, pk=None):
        try:
            recommandation = Recommandation.objects.get(id=pk)
            serializer = RecommandationSerializer(recommandation, data=request.data)
            if serializer.is_valid():
                recommandation = serializer.save()
                return Response(RecommandationSerializer(recommandation).data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Recommandation.DoesNotExist:
            return Response({'error': 'Recommandation introuvable'}, status=status.HTTP_404_NOT_FOUND)
    
    def destroy(self, request, pk=None):
        try:
            recommandation = Recommandation.objects.get(id=pk)
            recommandation.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Recommandation.DoesNotExist:
            return Response({'error': 'Recommandation introuvable'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'])
    def par_zone(self, request):
        """Récupérer les recommandations par zone géographique"""
        zone_id = request.query_params.get('zone_id')
        
        if not zone_id:
            return Response(
                {'error': 'zone_id requis en paramètre'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            zone = ZoneGeographique.objects.get(id=zone_id)
            recommandations = Recommandation.objects.filter(zone_geographique=zone)
            serializer = RecommandationSerializer(recommandations, many=True)
            return Response(serializer.data)
        except ZoneGeographique.DoesNotExist:
            return Response(
                {'error': 'Zone géographique introuvable'}, 
                status=status.HTTP_404_NOT_FOUND
            )

