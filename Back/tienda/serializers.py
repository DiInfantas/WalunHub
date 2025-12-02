from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User


# -----------------------------
# Imagen de Producto
# -----------------------------
class ImagenProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenProducto
        fields = ["id", "producto", "imagen"]


# -----------------------------
# Producto
# -----------------------------
class ProductoSerializer(serializers.ModelSerializer):
    categoria = serializers.PrimaryKeyRelatedField(queryset=Categoria.objects.all())
    imagenes = ImagenProductoSerializer(many=True, read_only=True)

    class Meta:
        model = Producto
        fields = "__all__"


# -----------------------------
# Categoría
# -----------------------------
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = "__all__"


# -----------------------------
# Estado Pedido
# -----------------------------
class EstadoPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoPedido
        fields = '__all__'


# -----------------------------
# Método Pago
# -----------------------------
class MetodoPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MetodoPago
        fields = '__all__'


# -----------------------------
# Item Pedido (lectura)
# -----------------------------
class ItemPedidoSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = ItemPedido
        fields = [
            "id",
            "producto",
            "cantidad",
            "precio_unitario",
            "peso_unitario",
            "peso_total_item",
            "subtotal",
        ]

    def get_subtotal(self, obj):
        return obj.cantidad * obj.precio_unitario


# -----------------------------
# Pedido (lectura)
# -----------------------------
class PedidoSerializer(serializers.ModelSerializer):
    cliente = serializers.StringRelatedField()
    items = ItemPedidoSerializer(many=True)
    estado = serializers.StringRelatedField()
    estado_pago = serializers.StringRelatedField()
    metodo_pago = serializers.StringRelatedField()

    class Meta:
        model = Pedido
        fields = "__all__"


# -----------------------------
# Contacto
# -----------------------------
class ContactoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contacto
        fields = ["id", "cliente", "nombre", "email", "mensaje", "fecha", "respondido"]
        read_only_fields = ["cliente", "fecha", "nombre", "email"]


# -----------------------------
# Item Pedido (creación)
# -----------------------------
class ItemPedidoCreateSerializer(serializers.ModelSerializer):
    producto = serializers.PrimaryKeyRelatedField(queryset=Producto.objects.all())

    class Meta:
        model = ItemPedido
        fields = ["producto", "cantidad", "precio_unitario"]

    def create(self, validated_data):
        producto = validated_data["producto"]

        validated_data["peso_unitario"] = producto.peso_kg
        validated_data["peso_total_item"] = producto.peso_kg * validated_data["cantidad"]

        return ItemPedido.objects.create(**validated_data)


# -----------------------------
# Pedido (creación)
# -----------------------------
class PedidoCreateSerializer(serializers.ModelSerializer):
    items = ItemPedidoCreateSerializer(many=True)

    class Meta:
        model = Pedido
        fields = [
            "id",
            "nombre",
            "direccion",
            "comuna",
            "telefono",
            "email",
            "estado",
            "estado_pago",
            "metodo_pago",
            "total",
            "tipo_entrega",
            "costo_envio_min",
            "costo_envio_max",
            "items",
            "payment_id",
            "cliente",
        ]

        read_only_fields = [
            "estado",
            "estado_pago",
            "costo_envio_min",
            "costo_envio_max",
            "payment_id",
            "cliente",
        ]

    def create(self, validated_data):
        request = self.context.get("request")

        items_data = validated_data.pop("items", [])

        # Estados por defecto (seguros)
        estado_pedido, _ = EstadoPedido.objects.get_or_create(nombre="Esperando pago")
        estado_pago, _ = EstadoPago.objects.get_or_create(nombre="Pendiente")

        validated_data["estado"] = estado_pedido
        validated_data["estado_pago"] = estado_pago

        # Asignación del cliente si está logueado
        validated_data["cliente"] = request.user if request and request.user.is_authenticated else None

        # Crear el pedido
        pedido = Pedido.objects.create(**validated_data)

        # Crear items con datos validados
        for item_data in items_data:
            item_serializer = ItemPedidoCreateSerializer(data=item_data)
            item_serializer.is_valid(raise_exception=True)
            item_serializer.save(pedido=pedido)

        # Cálculo total de peso para estimar envío
        total_peso = sum(
            float(item.producto.peso_kg or 0) * item.cantidad
            for item in pedido.items.all()
        )

        # Cálculo del envío
        if pedido.tipo_entrega == "retiro":
            min_envio, max_envio = 0, 0
        else:
            if total_peso <= 0.5:
                min_envio, max_envio = 3100, 4200
            elif total_peso <= 3:
                min_envio, max_envio = 4200, 4800
            elif total_peso <= 6:
                min_envio, max_envio = 4800, 5400
            elif total_peso <= 20:
                min_envio, max_envio = 5400, 5400
            else:
                min_envio, max_envio = 9999, 15000

        pedido.costo_envio_min = min_envio
        pedido.costo_envio_max = max_envio
        pedido.save()

        return pedido


# -----------------------------
# Pedido (actualización)
# -----------------------------
class PedidoUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = ["estado", "estado_pago", "blue_code"]
