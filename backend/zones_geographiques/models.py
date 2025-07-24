import datetime
from mongoengine import Document, StringField, IntField, FloatField, DateTimeField, ReferenceField, ListField
from authentification.models import User

class ZoneGeographique(Document):
    ville = StringField(required=True, max_length=100)
    rue = StringField(required=True, max_length=200)
    numero = IntField(required=True)
    latitude = StringField(required=True)
    longitude = StringField(required=True)
    rayon = FloatField(required=True)
    
    # Relation avec Utilisateur (un utilisateur habite dans une zone géographique)
    habitants = ListField(ReferenceField(User))
    
    created_at = DateTimeField(default=datetime.datetime.now(datetime.timezone.utc))
    updated_at = DateTimeField(default=datetime.datetime.now(datetime.timezone.utc))

    def __str__(self):
        return f"{self.numero} {self.rue}, {self.ville}"

    meta = {
        'collection': 'zones_geographiques'
    }

