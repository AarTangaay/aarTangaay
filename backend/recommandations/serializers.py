from rest_framework import serializers
from .models import Recommandation
from zones_geographiques.models import ZoneGeographique

class RecommandationSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    libelle = serializers.CharField(max_length=200)
    description = serializers.CharField(max_length=1000)
    zone_geographique_id = serializers.CharField(write_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    
    def create(self, validated_data):
        zone_id = validated_data.pop('zone_geographique_id')
        try:
            zone = ZoneGeographique.objects.get(id=zone_id)
        except ZoneGeographique.DoesNotExist:
            raise serializers.ValidationError("Zone géographique introuvable")
        
        recommandation = Recommandation(**validated_data)
        recommandation.zone_geographique = zone
        recommandation.save()
        return recommandation
    
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
            'libelle': instance.libelle,
            'description': instance.description,
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
        
        return data

