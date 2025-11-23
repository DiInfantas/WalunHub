from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied

class PuedeVerPedido(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        
        if request.user.is_staff:
            return True
        
        if hasattr(request.user, "es_vendedor") and request.user.es_vendedor:
            return True

        if obj.cliente == request.user:
            return True

        raise PermissionDenied("No tienes permiso para acceder a este pedido.")
