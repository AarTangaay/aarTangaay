import datetime
from mongoengine import Document, StringField, FloatField, DateTimeField, ReferenceField, ListField
from zones_geographiques.models import ZoneGeographique

class VagueChaleur(Document):
    temperature_max = FloatField(required=True)
    intensite = FloatField(required=True)
    humidite = FloatField(required=True)
    date_debut = DateTimeField(required=True)
    date_fin = DateTimeField(required=True)
    duree = DateTimeField(required=True)    
    
    # Relations
    # Une vague de chaleur provient d'une zone géographique (0..*)
    zone_geographique = ReferenceField(ZoneGeographique)
    
    created_at = DateTimeField(default=datetime.datetime.now(datetime.timezone.utc))
    updated_at = DateTimeField(default=datetime.datetime.now(datetime.timezone.utc))

    def __str__(self):
        return f"Vague de chaleur - {self.temperature_max}°C du {self.date_debut} au {self.date_fin}"

    meta = {
        'collection': 'vagues_chaleur'
    }

