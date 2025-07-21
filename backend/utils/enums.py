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
