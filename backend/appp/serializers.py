from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    role = serializers.CharField()

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'gender', 'password', 'role', 'avatar']


    def validate (self, data):
        if data["password"] != data['confirm_password']:
            raise serializers.ValidationError("password do not match")
        return data

    def create (self, validated_data):
        validated_data.pop('confirm_password')
        role = validated_data.pop("role")
        return User.objects.create_user(**validated_data)
    

class UpdateAvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['avatar']



class UserProfileSerializer(serializers.ModelSerializer):
    gender = serializers.ChoiceField(
        choices = UserProfile.GENDER_CHOICES,
        required = False,
        allow_blank = True
    )