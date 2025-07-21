from enum import Enum

class RoleEnum(Enum):
    ADMIN = "Administrateur"
    EXPERT = "Expert"
    USER = "Utilisateur"

    def __str__(self):
        return self.value

    @classmethod
    def choices(cls):
        return [(role.name, role.value) for role in cls]
