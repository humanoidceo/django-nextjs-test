from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import LoginView, UserViewSet, RoleViewSet

router = DefaultRouter()
router.register("users", UserViewSet)
router.register("roles", RoleViewSet)

urlpatterns = [
    path("login/",   LoginView.as_view(),         name="login"),
    path("refresh/", TokenRefreshView.as_view(),  name="token_refresh"),
    path("",         include(router.urls)),
]