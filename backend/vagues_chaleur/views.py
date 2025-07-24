from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import VagueChaleur
from .serializers import VagueChaleurSerializer
from zones_geographiques.models import ZoneGeographique

class VagueChaleurViewSet(viewsets.ViewSet):
    def list(self, request):
        vagues = VagueChaleur.objects.all()
        serializer = VagueChaleurSerializer(vagues, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        serializer = VagueChaleurSerializer(data=request.data)
        if serializer.is_valid():
            vague = serializer.save()
            return Response(VagueChaleurSerializer(vague).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, pk=None):
        try:
            vague = VagueChaleur.objects.get(id=pk)
            serializer = VagueChaleurSerializer(vague)
            return Response(serializer.data)
        except VagueChaleur.DoesNotExist:
            return Response({'error': 'Vague de chaleur introuvable'}, status=status.HTTP_404_NOT_FOUND)
    
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
    
    def destroy(self, request, pk=None):
        try:
            vague = VagueChaleur.objects.get(id=pk)
            vague.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except VagueChaleur.DoesNotExist:
            return Response({'error': 'Vague de chaleur introuvable'}, status=status.HTTP_404_NOT_FOUND)
    
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

