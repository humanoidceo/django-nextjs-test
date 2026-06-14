from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .managers import EmployeeManager
from .roles import ROLE_CHOICES, USER


class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    manager = models.ForeignKey(
        "employees.Employee", on_delete=models.SET_NULL,
        null=True, blank=True, related_name="managed_dept"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Employee(AbstractBaseUser, PermissionsMixin):
    STATUS = [("active", "Active"), ("inactive", "Inactive"), ("on_leave", "On Leave")]

    email       = models.EmailField(unique=True)
    name        = models.CharField(max_length=100)
    role        = models.CharField(max_length=20, choices=ROLE_CHOICES, default=USER)
    department  = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    employee_id = models.CharField(max_length=20, unique=True, blank=True, null=True)
    phone       = models.CharField(max_length=20, blank=True)
    address     = models.TextField(blank=True)
    hire_date   = models.DateField(null=True, blank=True)
    status      = models.CharField(max_length=20, choices=STATUS, default="active")
    position    = models.CharField(max_length=100, blank=True)
    salary      = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    is_active   = models.BooleanField(default=True)
    is_staff    = models.BooleanField(default=False)

    objects = EmployeeManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    def __str__(self):
        return f"{self.name} ({self.employee_id or 'no id'})"