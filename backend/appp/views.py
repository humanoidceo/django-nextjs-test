from rest_framework.generics import CreateAPIView, UpdateAPIView
from .serializers import RegisterSerializer, UpdateAvatarSerializer, UserProfileSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated                              
from rest_framework.parser import MultiPartParser, FormParser
from .models import User

class RegisterView(CreateAPIView):
    serializer_class = RegisterSerializer



class Login(APIView):
    def post (self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username = username, password=password)

        if user is None:
            return Response(
                {'error': "invalid credentials"},
                status = status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token


        response = Response(
            {"message": "Login successful!"}
        )

        # http only cookies
        response.set_cookie(
            key = "access_token",
            value = str(access),
            httponly = True,
            secure = False,
            samesite = "Lax"
        )

        response.set_cookie(
            key = "refresh_token",
            value = str (refresh),
            httponly=True,
            
        )
        

class UpdateAvatarView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def patch (self, request):
        serializer = UpdateAvatarSerializer(
            request.user,
            data = request.data,
            partial = True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response (serializer.errors, status=400)

class AvatarUploadView(APIView):
    permissions_classes = [IsAuthenticated]

    def post (self, request):
        profile, _ = User.objects.get_or_create(user=request.user)
        profile.avatar = request.FILES.get['avatar']
        profile.save()
        return Response({'avatar':request.build_absolute_uri(profile.avatar.url)})


class UserProfileView(APIView):
    def post (self, request):
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response (serializer.errors, status = status.HTTP_400_BAD_REQUEST)