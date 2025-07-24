from rest_framework import serializers
from .models import ZoneGeographique
from authentification.models import User

class ZoneGeographiqueSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    ville = serializers.CharField(max_length=100)
    rue = serializers.CharField(max_length=200)
    numero = serializers.IntegerField()
    latitude = serializers.CharField()
    longitude = serializers.CharField()
    rayon = serializers.FloatField()
    habitants = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True
    )
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    
    def create(self, validated_data):
        habitants_ids = validated_data.pop('habitants', [])
        zone = ZoneGeographique(**validated_data)
        
        # Ajouter les habitants
        for habitant_id in habitants_ids:
            try:
                habitant = User.objects.get(id=habitant_id)
                zone.habitants.append(habitant)
            except User.DoesNotExist:
                pass
        
        zone.save()
        return zone
    
    def update(self, instance, validated_data):
        habitants_ids = validated_data.pop('habitants', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if habitants_ids is not None:
            instance.habitants = []
            for habitant_id in habitants_ids:
                try:
                    habitant = User.objects.get(id=habitant_id)
                    instance.habitants.append(habitant)
                except User.DoesNotExist:
                    pass
        
        instance.save()
        return instance
        
    def to_representation(self, instance):
        data = {
            'id': str(instance.id),
            'ville': instance.ville,
            'rue': instance.rue,
            'numero': instance.numero,
            'latitude': instance.latitude,
            'longitude': instance.longitude,
            'rayon': instance.rayon,
            'created_at': instance.created_at,
            'updated_at': instance.updated_at
        }
        
        # Convertir les références d'utilisateurs en informations lisibles
        if instance.habitants:
            data['habitants'] = [
                {
                    'id': str(habitant.id),
                    'prenom': habitant.first_name,
                    'nom': habitant.last_name,
                    'email': habitant.email
                } for habitant in instance.habitants
            ]
        else:
            data['habitants'] = []
        return data

