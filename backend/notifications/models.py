import datetime
from mongoengine import Document, StringField, DateTimeField, BooleanField, ReferenceField
from authentification.models import User
from vagues_chaleur.models import VagueChaleur
from utils.enums import TypeNotification

class Notification(Document):
    libelle = StringField(required=True, max_length=200)
    type = StringField(choices=[t.name for t in TypeNotification], required=True)
    date_envoi = DateTimeField(required=True)
    lue = BooleanField(default=False)
    
    # Relations
    # Un utilisateur reçoit des notifications (1 vers 0..*)
    utilisateur = ReferenceField(User, required=True)
    # Une notification provient d'une vague de chaleur (1 vers 0..*)
    vague_chaleur = ReferenceField(VagueChaleur, required=True)
    
    created_at = DateTimeField(default=datetime.datetime.now(datetime.timezone.utc))
    updated_at = DateTimeField(default=datetime.datetime.now(datetime.timezone.utc))

    def __str__(self):
        return f"Notification {self.type} - {self.libelle}"

    meta = {
        'collection': 'notifications'
    }

