from rest_framework.permissions import BasePermission
from .roles import SUPER_ADMIN, ADMIN, USER


class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == SUPER_ADMIN


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in (SUPER_ADMIN, ADMIN)


class IsAdminOrSelf(BasePermission):
    """
    - super_admin and admin: can access any employee
    - user role: can only access their own record
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.user.role in (SUPER_ADMIN, ADMIN):
            return True
        return obj.id == request.user.id