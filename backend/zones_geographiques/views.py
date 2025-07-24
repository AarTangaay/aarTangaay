from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import ZoneGeographique
from .serializers import ZoneGeographiqueSerializer
from authentification.models import User

class ZoneGeographiqueViewSet(viewsets.ViewSet):
    def list(self, request):
        zones = ZoneGeographique.objects.all()
        serializer = ZoneGeographiqueSerializer(zones, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        serializer = ZoneGeographiqueSerializer(data=request.data)
        if serializer.is_valid():
            zone = serializer.save()
            return Response(ZoneGeographiqueSerializer(zone).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, pk=None):
        try:
            zone = ZoneGeographique.objects.get(id=pk)
            serializer = ZoneGeographiqueSerializer(zone)
            return Response(serializer.data)
        except ZoneGeographique.DoesNotExist:
            return Response({'error': 'Zone géographique introuvable'}, status=status.HTTP_404_NOT_FOUND)
    
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
    
    def destroy(self, request, pk=None):
        try:
            zone = ZoneGeographique.objects.get(id=pk)
            zone.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ZoneGeographique.DoesNotExist:
            return Response({'error': 'Zone géographique introuvable'}, status=status.HTTP_404_NOT_FOUND)
    
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

