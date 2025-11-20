import json
from decimal import Decimal
from django.http import JsonResponse
from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import (
    ProductoSerializer, CategoriaSerializer,
    PedidoSerializer, PedidoCreateSerializer,
    PedidoUpdateSerializer, ContactoSerializer,
    ImagenProductoSerializer
)
from .models import *
import mercadopago  # type: ignore
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt

# Productos
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

# Categorías
class CategoriaListView(generics.ListAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [AllowAny]

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAuthenticated]

# Crear pedido
class PedidoCreateView(generics.CreateAPIView):
    queryset = Pedido.objects.all()
    serializer_class = PedidoCreateSerializer
    permission_classes = []

    def perform_create(self, serializer):
        pedido = serializer.save()

        if pedido.tipo_entrega == "retiro":
            pedido.costo_envio = 0
            pedido.total = pedido.total
            pedido.save()
            return

        peso_total = sum(
            (item.producto.peso_kg or 0) * item.cantidad
            for item in pedido.items.all()
        )
        pedido.peso_total = peso_total

        if peso_total <= 0.5:
            costo = 3100
        elif peso_total <= 3:
            costo = 4200
        elif peso_total <= 6:
            costo = 4800
        elif peso_total <= 20:
            costo = 5400
        else:
            costo = 9999

        pedido.costo_envio = costo
        pedido.total += costo
        pedido.save()

# Contacto
class EnviarContactoView(generics.CreateAPIView):
    queryset = Contacto.objects.all()
    serializer_class = ContactoSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(cliente=user)

# MercadoPago
@api_view(["POST"])
def create_payment_preference(request):
    sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)

    items = request.data.get("items", [])
    pedido_id = str(request.data.get("pedido_id"))
    pedido = Pedido.objects.filter(id=pedido_id).first()

    preference_items = [
        {
            "title": item["title"],
            "quantity": int(item["quantity"]),
            "unit_price": float(item["unit_price"]),
            "currency_id": "CLP",
        }
        for item in items
    ]

    if pedido and pedido.costo_envio and pedido.costo_envio > 0:
        preference_items.append({
            "title": "Despacho BlueExpress",
            "quantity": 1,
            "unit_price": float(pedido.costo_envio),
            "currency_id": "CLP",
        })

    preference_data = {
        "items": preference_items,
        "back_urls": {
            "success": "https://google.com",
            "failure": "https://youtube.com",
            "pending": "https://youtube.com",
        },
        "auto_return": "approved",
        "notification_url": "http://tcx3w432-8000.brs.devtunnels.ms/api/mp/webhook/",
        "external_reference": pedido_id,
        "metadata": {
            "pedido_id": pedido_id,
            "shipping_weight": str(pedido.peso_total) if pedido else None,
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
    estado_pagado, _ = EstadoPago.objects.get_or_create(nombre="Pagado")
    pedido.estado_pago = estado_pagado

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

    return Response({"message": "OK"})

@api_view(["POST"])
def actualizar_estado_pago(request):
    pedido_id = request.data.get("pedido_id")
    estado = request.data.get("estado")
    payment_id = request.data.get("payment_id")

    try:
        pedido = Pedido.objects.get(id=pedido_id)
        pedido.payment_id = payment_id

        if estado == "approved":
            estado_pago, _ = EstadoPago.objects.get_or_create(nombre="Pagado")
        elif estado == "rejected":
            estado_pago, _ = EstadoPago.objects.get_or_create(nombre="Rechazado")
        else:
            estado_pago, _ = EstadoPago.objects.get_or_create(nombre="Pendiente")

        pedido.estado_pago = estado_pago
        pedido.save()
        return Response({"message": "Pedido actualizado"})

    except Pedido.DoesNotExist:
        return Response({"error": "Pedido no encontrado"}, status=404)

# Pedidos
class PedidoListView(generics.ListAPIView):
    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Pedido.objects.filter(cliente=self.request.user).order_by('-id')

class PedidoAdminListView(generics.ListAPIView):
    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Pedido.objects.all().order_by("-id")

        estado = self.request.query_params.get("estado")
        estado_pago = self.request.query_params.get("estado_pago")
        email = self.request.query_params.get("email")
        nombre = self.request.query_params.get("nombre")
        tipo_entrega = self.request.query_params.get("tipo_entrega")

        if estado:
            queryset = queryset.filter(estado__nombre__icontains=estado)
        if estado_pago:
            queryset = queryset.filter(estado_pago__nombre__icontains=estado_pago)
        if email:
            queryset = queryset.filter(email__icontains=email)
        if nombre:
            queryset = queryset.filter(nombre__icontains=nombre)
        if tipo_entrega:
            queryset = queryset.filter(tipo_entrega__iexact=tipo_entrega)

        return queryset

class PedidoRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Pedido.objects.all()
    permission_classes = [IsAuthenticated]
    lookup_field = "id"  # 👈 esta línea es clave

    def get_serializer_class(self):
        if self.request.method == "GET":
            return PedidoSerializer
        return PedidoUpdateSerializer

# Estados dinámicos
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def listar_estados_pedido(request):
    estados = EstadoPedido.objects.all().values("id", "nombre")
    return Response(list(estados))

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def listar_estados_pago(request):
    estados = EstadoPago.objects.all().values("id", "nombre")
    return Response(list(estados))

# Imágenes
class ImagenProductoViewSet(viewsets.ModelViewSet):
    queryset = ImagenProducto.objects.all()
    serializer_class = ImagenProductoSerializer
    permission_classes = [IsAuthenticated]

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def listar_estados_pago(request):
    estados = EstadoPago.objects.all().values("id", "nombre")
    return Response(list(estados))