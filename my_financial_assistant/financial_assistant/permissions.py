from django.contrib.auth.models import AnonymousUser
from rest_framework.permissions import BasePermission


class ProfileOwnerPermission(BasePermission):

    def has_object_permission(self, request, view, obj):
        current_user = request.user
        if type(current_user) != AnonymousUser:
            return obj.user == request.user
        return False
