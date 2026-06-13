from django.urls import path
from .views import TaskCreateView, TaskDetailView


urlpatterns = [
    path('tasks/create/', TaskCreateView.as_view()),
    path('tasks/<int:pk>', TaskDetailView.as_view()),
]