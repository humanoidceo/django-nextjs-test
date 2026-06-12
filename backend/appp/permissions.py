from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    def has_permission(self, req, view):
        return req.user.is_authenticated and getattr(req.user.role, "name", None) == "admin"

class IsManagerOrAdmin(BasePermission):
    def has_permission(self, req, view):
        return req.user.is_authenticated and getattr(req.user.role, "name", None) in ("admin", "manager")