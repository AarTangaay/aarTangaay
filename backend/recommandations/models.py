import datetime
from mongoengine import Document, StringField, DateTimeField, ReferenceField
from zones_geographiques.models import ZoneGeographique

class Recommandation(Document):
    libelle = StringField(required=True, max_length=200)
    description = StringField(required=True, max_length=1000)
    
    # Relations
    # Une recommandation est liée à une zone géographique (1 vers 0..*)
    zone_geographique = ReferenceField(ZoneGeographique, required=True)
    
    created_at = DateTimeField(default=datetime.datetime.now(datetime.timezone.utc))
    updated_at = DateTimeField(default=datetime.datetime.now(datetime.timezone.utc))

    def __str__(self):
        return f"Recommandation: {self.libelle}"

    meta = {
        'collection': 'recommandations'
    }

