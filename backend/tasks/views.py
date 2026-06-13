from rest_framework.generics import CreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from .serializers import TaskSerializer
from .models import Task


class TaskCreateView(CreateAPIView):
    queryset = Task.objects.all()
    serializer_class = [TaskSerializer]

class TaskDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

