from rest_framework import serializers
from .models import Notification
from authentification.models import User
from vagues_chaleur.models import VagueChaleur

class NotificationSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    libelle = serializers.CharField(max_length=200)
    type = serializers.CharField()
    date_envoi = serializers.DateTimeField()
    lue = serializers.BooleanField(default=False)
    utilisateur_id = serializers.CharField(write_only=True)
    vague_chaleur_id = serializers.CharField(write_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    
    def create(self, validated_data):
        utilisateur_id = validated_data.pop('utilisateur_id')
        vague_chaleur_id = validated_data.pop('vague_chaleur_id')
        
        try:
            utilisateur = User.objects.get(id=utilisateur_id)
            vague_chaleur = VagueChaleur.objects.get(id=vague_chaleur_id)
        except User.DoesNotExist:
            raise serializers.ValidationError("Utilisateur introuvable")
        except VagueChaleur.DoesNotExist:
            raise serializers.ValidationError("Vague de chaleur introuvable")
        
        notification = Notification(**validated_data)
        notification.utilisateur = utilisateur
        notification.vague_chaleur = vague_chaleur
        notification.save()
        return notification
    
    def update(self, instance, validated_data):
        utilisateur_id = validated_data.pop('utilisateur_id', None)
        vague_chaleur_id = validated_data.pop('vague_chaleur_id', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if utilisateur_id:
            try:
                utilisateur = User.objects.get(id=utilisateur_id)
                instance.utilisateur = utilisateur
            except User.DoesNotExist:
                raise serializers.ValidationError("Utilisateur introuvable")
        
        if vague_chaleur_id:
            try:
                vague_chaleur = VagueChaleur.objects.get(id=vague_chaleur_id)
                instance.vague_chaleur = vague_chaleur
            except VagueChaleur.DoesNotExist:
                raise serializers.ValidationError("Vague de chaleur introuvable")
        
        instance.save()
        return instance
        
    def to_representation(self, instance):
        data = {
            'id': str(instance.id),
            'libelle': instance.libelle,
            'type': instance.type,
            'date_envoi': instance.date_envoi,
            'lue': instance.lue,
            'created_at': instance.created_at,
            'updated_at': instance.updated_at
        }
        
        # Ajouter les informations de l'utilisateur
        if instance.utilisateur:
            data['utilisateur'] = {
                'id': str(instance.utilisateur.id),
                'prenom': instance.utilisateur.first_name,
                'nom': instance.utilisateur.last_name,
                'email': instance.utilisateur.email
            }
        
        # Ajouter les informations de la vague de chaleur
        if instance.vague_chaleur:
            data['vague_chaleur'] = {
                'id': str(instance.vague_chaleur.id),
                'temperature_max': instance.vague_chaleur.temperature_max,
                'date_debut': instance.vague_chaleur.date_debut,
                'date_fin': instance.vague_chaleur.date_fin
            }
        
        return data

