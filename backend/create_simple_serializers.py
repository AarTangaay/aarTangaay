#!/usr/bin/env python3
"""
Script pour créer des sérialiseurs simples pour tous les modèles
"""

# Sérialiseur pour VagueChaleur
vague_chaleur_serializer = '''from rest_framework import serializers
from .models import VagueChaleur
from zones_geographiques.models import ZoneGeographique

class VagueChaleurSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    temperature_max = serializers.FloatField()
    intensite = serializers.FloatField()
    humidite = serializers.FloatField()
    date_debut = serializers.DateTimeField()
    date_fin = serializers.DateTimeField()
    duree = serializers.DateTimeField()
    zone_geographique_id = serializers.CharField(write_only=True, required=False)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    
    def create(self, validated_data):
        zone_id = validated_data.pop('zone_geographique_id', None)
        vague = VagueChaleur(**validated_data)
        
        if zone_id:
            try:
                zone = ZoneGeographique.objects.get(id=zone_id)
                vague.zone_geographique = zone
            except ZoneGeographique.DoesNotExist:
                raise serializers.ValidationError("Zone géographique introuvable")
        
        vague.save()
        return vague
    
    def update(self, instance, validated_data):
        zone_id = validated_data.pop('zone_geographique_id', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if zone_id:
            try:
                zone = ZoneGeographique.objects.get(id=zone_id)
                instance.zone_geographique = zone
            except ZoneGeographique.DoesNotExist:
                raise serializers.ValidationError("Zone géographique introuvable")
        
        instance.save()
        return instance
        
    def to_representation(self, instance):
        data = {
            'id': str(instance.id),
            'temperature_max': instance.temperature_max,
            'intensite': instance.intensite,
            'humidite': instance.humidite,
            'date_debut': instance.date_debut,
            'date_fin': instance.date_fin,
            'duree': instance.duree,
            'created_at': instance.created_at,
            'updated_at': instance.updated_at
        }
        
        # Ajouter les informations de la zone géographique
        if instance.zone_geographique:
            data['zone_geographique'] = {
                'id': str(instance.zone_geographique.id),
                'ville': instance.zone_geographique.ville,
                'rue': instance.zone_geographique.rue,
                'numero': instance.zone_geographique.numero
            }
        else:
            data['zone_geographique'] = None
        return data
'''

# Écrire le fichier
with open('/home/ubuntu/backend/vagues_chaleur/serializers.py', 'w') as f:
    f.write(vague_chaleur_serializer)

print("Sérialiseur VagueChaleur créé avec succès")

