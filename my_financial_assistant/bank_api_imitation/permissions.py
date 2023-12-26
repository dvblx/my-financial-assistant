from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response


def sender_permission(request, sender_id):
    if request.user.is_authenticated():
        if request.user.id == sender_id:
            return
    raise PermissionDenied('access denied')


def recipient_permission(request, recipient_id):
    if request.user.is_authenticated():
        if request.user.id == recipient_id:
            return
        return Response({'error': 'access denied'}, status=401)
    return Response({'error': 'unauthorized'}, status=403)

