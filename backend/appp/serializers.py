from django.contrib.auth.models import User
from rest_framework import serializers

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'first_name',
            'email',
            'password',
            'confirm_password'
        ]

        def validate(self, attrs):
            if attrs['password'] != attrs['confirm_password']:
                raise serializers.ValidationError(
                    {"confirm_password": "Passwords do not match"}
                )
            
            return attrs
        
        def create (self, validated_data):
            validated_data.pop('confirm_password')

            user = User.objects.create_user(
                username=validated_data['email'],
                first_name=validated_data['first_name'],
                email=validated_data['email'],
                password=validated_data['password']
            )

            return user