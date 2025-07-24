from enum import Enum

class RoleEnum(Enum):
    ADMIN = "Administrateur"
    AGENT = "Agent Sanitaire"
    EXPERT = "Lanceur d'alerte"
    USER = "Utilisateur"

    def __str__(self):
        return self.value

    @classmethod
    def choices(cls):
        return [(role.name, role.value) for role in cls]

class TypeNotification(Enum):
    SMS = "sms"
    NOTIFICATION_PUSH = "notificationPush"
    EMAIL = "email"

    def __str__(self):
        return self.value

    @classmethod
    def choices(cls):
        return [(type_notif.name, type_notif.value) for type_notif in cls]
