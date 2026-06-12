from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from .serializers import TaskSerializer
from .models import Task


class TaskCreateView(CreateAPIView):
    queryset = Task.objects.all()
    serializer_class = [TaskSerializer]
