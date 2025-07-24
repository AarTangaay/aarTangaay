from rest_framework import serializers
from .models import Statistique
from vagues_chaleur.models import VagueChaleur

class StatistiqueSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    temperature_moyenne = serializers.FloatField()
    nombre_vague = serializers.IntegerField()
    vague_chaleur_id = serializers.CharField(write_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    
    def create(self, validated_data):
        vague_chaleur_id = validated_data.pop('vague_chaleur_id')
        try:
            vague_chaleur = VagueChaleur.objects.get(id=vague_chaleur_id)
        except VagueChaleur.DoesNotExist:
            raise serializers.ValidationError("Vague de chaleur introuvable")
        
        statistique = Statistique(**validated_data)
        statistique.vague_chaleur = vague_chaleur
        statistique.save()
        return statistique
    
    def update(self, instance, validated_data):
        vague_chaleur_id = validated_data.pop('vague_chaleur_id', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
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
            'temperature_moyenne': instance.temperature_moyenne,
            'nombre_vague': instance.nombre_vague,
            'created_at': instance.created_at,
            'updated_at': instance.updated_at
        }
        
        # Ajouter les informations de la vague de chaleur
        if instance.vague_chaleur:
            data['vague_chaleur'] = {
                'id': str(instance.vague_chaleur.id),
                'temperature_max': instance.vague_chaleur.temperature_max,
                'intensite': instance.vague_chaleur.intensite,
                'date_debut': instance.vague_chaleur.date_debut,
                'date_fin': instance.vague_chaleur.date_fin
            }
        
        return data

