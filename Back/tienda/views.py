import json
from decimal import Decimal
from django.core.mail import send_mail, EmailMultiAlternatives
from rest_framework import status
from django.http import JsonResponse
from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from .permissions import PuedeVerPedido
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


def correopedido(pedido):
    if not pedido.email:
        return 

    subject = f"Confirmación de pedido #{pedido.id} - WalunHub"
    from_email = settings.EMAIL_HOST_USER
    to = [pedido.email]

    items_html = ""
    for item in pedido.items.all():
        items_html += f"""
            <tr>
                <td style="padding: 6px 10px;">{item.producto.nombre}</td>
                <td style="padding: 6px 10px; text-align:center;">{item.cantidad}</td>
                <td style="padding: 6px 10px;">${item.precio_unitario}</td>
            </tr>
        """

    html_content = f"""
        <h2>Gracias por tu compra 🛒</h2>

        <p>Hola <b>{pedido.nombre}</b>,</p>
        <p>Tu pedido ha sido recibido correctamente. Aquí tienes los detalles:</p>

        <h3>📦 Pedido #{pedido.id}</h3>

        <table style="width:100%; border-collapse: collapse;">
            <thead>
                <tr style="background:#f3f3f3;">
                    <th style="padding: 6px 10px; text-align:left;">Producto</th>
                    <th style="padding: 6px 10px; text-align:center;">Cantidad</th>
                    <th style="padding: 6px 10px; text-align:left;">Precio unitario</th>
                </tr>
            </thead>
            <tbody>
                {items_html}
            </tbody>
        </table>

        <p><b>Total pagado:</b> ${pedido.total}</p>
        <p><b>Método de pago:</b> {pedido.metodo_pago}</p>

        <h3>📍 Datos de entrega</h3>
        <p>
            <b>Dirección:</b> {pedido.direccion}<br>
            <b>Comuna:</b> {pedido.comuna}<br>
            <b>Teléfono:</b> {pedido.telefono}<br>
        </p>

        <br>

        <p>Puedes ver tu pedido en tu panel de gestión aquí:<br>
        <a href="https://26jw2jkc-5173.brs.devtunnels.ms/dashboard">Ir a mi panel de pedidos</a></p>

        <p>Gracias por confiar en <b>WalunHub</b> 💚</p>
    """
    msg = EmailMultiAlternatives(subject, "", from_email, to)
    msg.attach_alternative(html_content, "text/html")
    msg.send()


class PedidoCreateView(generics.CreateAPIView):
    queryset = Pedido.objects.all()
    serializer_class = PedidoCreateSerializer
    permission_classes = []

# Contacto
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
    pedido_id = str(request.data.get("pedido_id"))
    pedido = Pedido.objects.filter(id=pedido_id).first()

    if not pedido:
        return Response({"error": "Pedido no encontrado"}, status=404)

    preference_items = [
        {
            "title": item["title"],
            "quantity": int(item["quantity"]),
            "unit_price": float(item["unit_price"]),
            "currency_id": "CLP",
        }
        for item in items
    ]

    preference_data = {
        "items": preference_items,
        "back_urls": {
            "success": "https://26jw2jkc-5173.brs.devtunnels.ms/pago/success",
            "failure": "https://26jw2jkc-5173.brs.devtunnels.ms/pago/failure",
            "pending": "https://26jw2jkc-5173.brs.devtunnels.ms/pago/pending",
        },
        "auto_return": "approved",
        "notification_url": "https://26jw2jkc-8000.brs.devtunnels.ms/api/mp/webhook/",
        "external_reference": pedido_id,
        "metadata": {
            "pedido_id": pedido_id,
            "shipping_min": pedido.costo_envio_min,
            "shipping_max": pedido.costo_envio_max,
        },
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

    status_mp = info_pago.get("status")
    status_detail = info_pago.get("status_detail")

    metadata = info_pago.get("metadata", {})
    pedido_id = metadata.get("pedido_id")

    if not pedido_id:
        return Response({"error": "metadata.pedido_id requerido"}, status=400)

    try:
        pedido = Pedido.objects.get(id=pedido_id)
    except Pedido.DoesNotExist:
        return Response({"error": "pedido no existe"}, status=404)

    # Evitar doble procesamiento
    if pedido.payment_id == payment_id:
        return Response({"message": "pago ya procesado"}, status=200)

    pedido.payment_id = payment_id

    pago_pendiente  = EstadoPago.objects.get(nombre="Pendiente")
    pago_pagado     = EstadoPago.objects.get(nombre="Pagado")
    pago_rechazado  = EstadoPago.objects.get(nombre="Rechazado")
    pago_devuelto   = EstadoPago.objects.get(nombre="Devuelto")

    pedido_esperando = EstadoPedido.objects.get(nombre="Esperando pago")
    pedido_pagado = EstadoPedido.objects.get(nombre="Pago confirmado")
    pedido_cancelado = EstadoPedido.objects.get(nombre="Cancelado")
    pedido_devuelto = EstadoPedido.objects.get(nombre="Devuelto")


    if status_mp == "approved":
        pedido.estado_pago = pago_pagado
        pedido.estado = pedido_pagado

        # Ticket URL
        pedido.ticket_url = (
            info_pago.get("transaction_details", {}).get("external_resource_url")
            or info_pago.get("receipt_url")
        )
        correopedido(pedido)
        # for item in pedido.items.all():
        #     producto = item.producto
        #     producto.stock = max(0, producto.stock - item.cantidad)
        #     producto.save()

    elif status_mp in ["pending", "in_process"]:
        pedido.estado_pago = pago_pendiente
        pedido.estado = pedido_esperando

    elif status_mp == "rejected":
        pedido.estado_pago = pago_rechazado
        pedido.estado = pedido_cancelado

    elif status_mp == "refunded" or status_detail == "refunded":
        pedido.estado_pago = pago_devuelto
        pedido.estado = pedido_devuelto

        # for item in pedido.items.all():
        #     producto = item.producto
        #     producto.stock += item.cantidad
        #     producto.save()

    else:
        pedido.estado_pago = pago_pendiente
        pedido.estado = pedido_esperando

    pedido.save()

    return Response({"message": "OK"}, status=200)


@api_view(["POST"])
def actualizar_estado_pago(request):
    pedido_id = request.data.get("pedido_id")
    estado = request.data.get("estado")
    payment_id = request.data.get("payment_id")

    try:
        pedido = Pedido.objects.get(id=pedido_id)
        pedido.payment_id = payment_id

        estado_pago_pagado = EstadoPago.objects.get(nombre="Pagado")
        estado_pago_pendiente = EstadoPago.objects.get(nombre="Pendiente")
        estado_pago_rechazado = EstadoPago.objects.get(nombre="Rechazado")

        estado_pedido_pagado = EstadoPedido.objects.get(nombre="Pago confirmado")
        estado_pedido_pendiente = EstadoPedido.objects.get(nombre="Esperando pago")
        estado_pedido_cancelado = EstadoPedido.objects.get(nombre="Cancelado")

        if estado == "approved":
            pedido.estado_pago = estado_pago_pagado
            pedido.estado = estado_pedido_pagado

        elif estado == "rejected":
            pedido.estado_pago = estado_pago_rechazado
            pedido.estado = estado_pedido_cancelado

        else:
            pedido.estado_pago = estado_pago_pendiente
            pedido.estado = estado_pedido_pendiente

        pedido.save()
        return Response({"message": "Pedido actualizado correctamente"})

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
    lookup_field = "id"

    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAuthenticated(), PuedeVerPedido()]
        
        if self.request.method in ["PATCH", "PUT"]:
            return [IsAuthenticated(), PuedeVerPedido()]
        
        return super().get_permissions()

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