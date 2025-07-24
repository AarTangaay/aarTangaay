from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Notification
from .serializers import NotificationSerializer
from authentification.models import User

class NotificationViewSet(viewsets.ViewSet):
    def list(self, request):
        notifications = Notification.objects.all()
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)
    
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

