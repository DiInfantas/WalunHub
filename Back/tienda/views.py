import json
from django.http import JsonResponse
from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import ContactoSerializer
from .models import Contacto
import mercadopago # type: ignore
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt




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
    permission_classes = []


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
    pedido_id = str(request.data.get("pedido_id"))  # SIEMPRE STRING

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
            "success": "https://26jw2jkc-5173.brs.devtunnels.ms/pago/success",
            "failure":  "https://26jw2jkc-5173.brs.devtunnels.ms/pago/failure",
            "pending":  "https://26jw2jkc-5173.brs.devtunnels.ms/pago/pending",
        },

        "auto_return": "approved",

        "notification_url": "https://26jw2jkc-8000.brs.devtunnels.ms/api/mp/webhook/",

        "external_reference": pedido_id,

        "metadata": {
            "pedido_id": pedido_id
        }
    }

    preference = sdk.preference().create(preference_data)
    return Response(preference["response"])


@api_view(["POST"])
def mp_webhook(request):
    sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)

    payment_id = None

    if "data" in request.data and "id" in request.data["data"]:
        payment_id = request.data["data"]["id"]
    elif "id" in request.data and str(request.data["id"]).isdigit():
        payment_id = request.data["id"]
    elif "resource" in request.data:
        res = request.data["resource"]
        if isinstance(res, str) and res.isdigit():
            payment_id = res

    if not payment_id:
        return Response({"error": "payment_id requerido"}, status=400)

    pago = sdk.payment().get(payment_id)
    info_pago = pago.get("response", {})

    if not info_pago:
        return Response({"error": "pago no encontrado"}, status=404)

    if info_pago.get("status") != "approved":
        return Response({"message": "OK, esperando aprobación"}, status=200)

    metadata = info_pago.get("metadata", {})
    pedido_id = metadata.get("pedido_id")

    if not pedido_id:
        return Response({"error": "metadata.pedido_id es requerido"}, status=400)

    try:
        pedido = Pedido.objects.get(id=pedido_id)
    except Pedido.DoesNotExist:
        return Response({"error": "pedido no existe"}, status=404)

    if pedido.payment_id:
        return Response({"message": "pago ya procesado"}, status=200)

    pedido.payment_id = payment_id
    estado_pagado, _ = EstadoPedido.objects.get_or_create(nombre="Pagado")
    pedido.estado = estado_pagado

    ticket_url = (
        info_pago.get("transaction_details", {}).get("external_resource_url")
        or info_pago.get("receipt_url")
        or None
    )
    pedido.ticket_url = ticket_url

    pedido.save()

    for item in pedido.items.all():
        producto = item.producto
        producto.stock = max(0, producto.stock - item.cantidad)
        producto.save()

    return Response({"message": "OK"}, status=200)

# El webhook recibe las notificaciones de MercadoPago, extrae el ID del pago y consulta a MP para confirmar si está aprobado; 
# si lo está, obtiene el pedido usando el pedido_id enviado en la metadata, evita procesarlo dos veces, 
# guarda el payment_id, cambia su estado a “Pagado” y descuenta del stock real la cantidad de cada producto comprado, 
# asegurando que el pedido quede correctamente actualizado incluso si el usuario no vuelve al sitio.

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

