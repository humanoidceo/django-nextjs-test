from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, Role



class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Role
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    role_detail = RoleSerializer(source="role", read_only=True)

    class Meta:
        model  = User
        fields = ["id", "email", "      username", "first_name", "last_name",
                  "role", "role_detail", "avatar", "is_active", "date_joined"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated):
        pw = validated.pop("password", None)
        user = User(**validated)
        if pw: user.set_password(pw)
        user.save()
        return user


class CustomTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["email"] = user.email
        token["role"]  = user.role.name if user.role else None
        return token


