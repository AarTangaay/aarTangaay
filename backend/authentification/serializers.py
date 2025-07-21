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
    # id = serializers.UUIDField(source='uuid', read_only=True)
    class Meta:
        model = User
        fields = [
            'user_id', 
            'last_name',
            'first_name', 
            'email',
            'phone_number', 
            'is_active',
            'is_staff', 
            'role',
            'created_at', 
            'updated_at'
            ]
        read_only_fields = ['user_id', 'email', 'created_at', 'updated_at']
