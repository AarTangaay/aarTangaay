from rest_framework import serializers
from .models import User
from utils.enums import RoleEnum

class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField()
    phone_number = serializers.CharField()
    role = serializers.ChoiceField(
        choices=[(role.name, role.value) for role in RoleEnum],
        default=RoleEnum.USER.name
    )

    def validate_email(self, value):
        if User.objects(email=value).first():
            raise serializers.ValidationError("Email déjà utilisé")
        return value
    
    
    def validate_phone_number(self, value):
        """Vérifie si le numéro est déjà utilisé"""
        if User.objects(phone_number=value).first():
            raise serializers.ValidationError("Ce numéro est déjà utilisé.")
        return value

    def validate_role(self, value):
        """Valide le rôle selon l'enum"""
        if value not in [role.name for role in RoleEnum]:
            raise serializers.ValidationError("Rôle invalide.")
        return value

    def create(self, validated_data):
        """Crée un utilisateur avec un mot de passe hashé"""
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class UserSerializer(serializers.Serializer):
    user_id = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    phone_number = serializers.CharField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    is_staff = serializers.BooleanField(read_only=True)
    role = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    
    def to_representation(self, instance):
        """Extrait les données depuis l'objet User MongoDB"""
        return {
            'user_id': instance.user_id,
            'last_name': instance.last_name,
            'first_name': instance.first_name,
            'email': instance.email,
            'phone_number': instance.phone_number,
            'is_active': instance.is_active,
            'is_staff': instance.is_staff,
            'role': instance.role,
            'created_at': instance.created_at,
            'updated_at': instance.updated_at,
        }
