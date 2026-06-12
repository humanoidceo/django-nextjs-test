from django.contrib.auth.models import AbstractUser
from django.db import models

class Department(models.Model):
    name        = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    manager     = models.ForeignKey(
        "employees.Employee", on_delete=models.SET_NULL,
        null=True, blank=True, related_name="managed_dept"
    )
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self): return self.name


class Employee(models.Model):
    STATUS = [("active","Active"),("inactive","Inactive"),("on_leave","On Leave")]

    user       = models.OneToOneField(AbstractUser, on_delete=models.CASCADE, related_name="employee")
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True)
    employee_id= models.CharField(max_length=20, unique=True)
    phone      = models.CharField(max_length=20, blank=True)
    address    = models.TextField(blank=True)
    hire_date  = models.DateField()
    status     = models.CharField(max_length=20, choices=STATUS, default="active")
    position   = models.CharField(max_length=100, blank=True)
    salary     = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    def __str__(self): return f"{self.user.get_full_name()} ({self.employee_id})"