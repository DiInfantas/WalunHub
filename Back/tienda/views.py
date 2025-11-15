from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import ContactoSerializer
from .models import Contacto
import mercadopago # type: ignore
from django.conf import settings

from .models import *
from .serializers import (
    ProductoSerializer, CategoriaSerializer,
    PedidoSerializer, PedidoCreateSerializer,
    ContactoSerializer
)


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.filter(activo=True)
    serializer_class = ProductoSerializer
    permission_classes = [permissions.AllowAny]

class ProductoListView(generics.ListAPIView):
    queryset = Producto.objects.filter(activo=True)
    serializer_class = ProductoSerializer
    permission_classes = [AllowAny]

class ProductoDetailView(generics.RetrieveAPIView):
    queryset = Producto.objects.filter(activo=True)
    serializer_class = ProductoSerializer
    lookup_field = "id"
    permission_classes = [AllowAny]


class CategoriaListView(generics.ListAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [AllowAny]


class PedidoCreateView(generics.CreateAPIView):
    queryset = Pedido.objects.all()
    serializer_class = PedidoCreateSerializer     
    permission_classes = [IsAuthenticated]


class EnviarContactoView(generics.CreateAPIView):
    queryset = Contacto.objects.all()
    serializer_class = ContactoSerializer
    permission_classes = [permissions.AllowAny]


    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(cliente=user)



@api_view(["POST"])
def create_payment_preference(request):
    sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)

    items = request.data.get("items", [])
    pedido_id = request.data.get("pedido_id")

    preference_data = {
        "items": [
            {
                "title": item["title"],
                "quantity": int(item["quantity"]),
                "unit_price": float(item["unit_price"]),
                "currency_id": "CLP",
            }
            for item in items
        ],
        "back_urls": {
            "success": "https://www.google.com",  # cambiar luego a ngrok o dominio real
            "failure": "https://www.google.com",
            "pending": "https://www.google.com",
        },
        "auto_return": "approved",
        "metadata": {
            "pedido_id": pedido_id
        }
    }

    preference = sdk.preference().create(preference_data)
    return Response(preference["response"])



@api_view(["POST"])
def actualizar_estado_pago(request):
    pedido_id = request.data.get("pedido_id")
    estado = request.data.get("estado")
    payment_id = request.data.get("payment_id")

    try:
        pedido = Pedido.objects.get(id=pedido_id)
        pedido.payment_id = payment_id

        if estado == "approved":
            pedido.estado_id = 2
        elif estado == "rejected":
            pedido.estado_id = 3
        else:
            pedido.estado_id = 1

        pedido.save()
        return Response({"message": "Pedido actualizado"})

    except Pedido.DoesNotExist:
        return Response({"error": "Pedido no encontrado"}, status=404)


class PedidoListView(generics.ListAPIView):
    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Pedido.objects.filter(cliente=self.request.user).order_by('-id')

class PedidoDetailView(generics.RetrieveAPIView):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticated]

