import datetime
from mongoengine import Document, FloatField, IntField, DateTimeField, ReferenceField
from vagues_chaleur.models import VagueChaleur

class Statistique(Document):
    temperature_moyenne = FloatField(required=True)
    nombre_vague = IntField(required=True)
    
    # Relations
    # Une statistique est liée à une vague de chaleur (1 vers 1)
    vague_chaleur = ReferenceField(VagueChaleur, required=True, unique=True)
    
    created_at = DateTimeField(default=datetime.datetime.now(datetime.timezone.utc))
    updated_at = DateTimeField(default=datetime.datetime.now(datetime.timezone.utc))

    def __str__(self):
        return f"Statistique - Temp moy: {self.temperature_moyenne}°C, Nb vagues: {self.nombre_vague}"

    meta = {
        'collection': 'statistiques'
    }

