from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import User, Role
from .serializers import UserSerializer, RoleSerializer, CustomTokenSerializer
from .permissions import IsAdmin

class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class   = CustomTokenSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset           = User.objects.all().select_related("role")
    serializer_class   = UserSerializer
    permission_classes = [IsAdmin]
    search_fields      = ["email", "first_name", "last_name"]
    ordering_fields    = ["date_joined", "email"]


class RoleViewSet(viewsets.ModelViewSet):
    queryset           = Role.objects.all()
    serializer_class   = RoleSerializer
    permission_classes = [IsAdmin]
