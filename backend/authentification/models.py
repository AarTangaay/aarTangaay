import datetime
import uuid
from mongoengine import Document, StringField, UUIDField, DateTimeField, BooleanField
from django.contrib.auth.hashers import make_password, check_password
from utils.enums import RoleEnum

class User(Document):
    user_id = StringField(default=lambda: str(uuid.uuid4()), unique=True)
    last_name = StringField(required=True, unique=True, max_length=25)
    first_name  = StringField(max_length=30)
    email = StringField(required=True, unique=True)
    phone_number = StringField(required=True, unique=True)
    password = StringField(required=True)
    is_active = BooleanField(default=True)
    is_staff = BooleanField(default=False)
    role = StringField(choices=[r.name for r in RoleEnum], default=RoleEnum.USER.name)
    created_at = DateTimeField(default=datetime.datetime.now(datetime.timezone.utc))
    updated_at = DateTimeField(default=datetime.datetime.now(datetime.timezone.utc))

    def set_password(self, raw_password):   
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.role})"
