from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

User = get_user_model()

class RegistroUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        Token.objects.create(user=user)
        return user

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email",  "es_vendedor")




from django.contrib.auth.hashers import make_password


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.IntegerField()
    new_password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            user = User.objects.get(email=data["email"], key=data["code"])
        except User.DoesNotExist:
            raise serializers.ValidationError("Correo o código inválido")
        data["user"] = user
        return data

    def save(self, **kwargs):
        user = self.validated_data["user"]
        user.password = make_password(self.validated_data["new_password"])
        user.key = None
        user.save()
        return user

