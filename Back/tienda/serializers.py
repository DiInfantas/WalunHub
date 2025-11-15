from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User

class ImagenProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenProducto
        fields = ["id", "imagen"]

class ProductoSerializer(serializers.ModelSerializer):
    categoria = serializers.StringRelatedField()
    imagenes = ImagenProductoSerializer(many=True, read_only=True)

    class Meta:
        model = Producto
        fields = "__all__"

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = "__all__"

class EstadoPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoPedido
        fields = '__all__'

class MetodoPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MetodoPago
        fields = '__all__'

class ItemPedidoSerializer(serializers.ModelSerializer):
    producto = serializers.StringRelatedField()

    class Meta:
        model = ItemPedido
        fields = "__all__"

class PedidoSerializer(serializers.ModelSerializer):
    cliente = serializers.StringRelatedField()
    items = ItemPedidoSerializer(many=True)

    class Meta:
        model = Pedido
        fields = "__all__"

class EnvioSerializer(serializers.ModelSerializer):
    pedido = serializers.StringRelatedField()

    class Meta:
        model = Envio
        fields = '__all__'

class ContactoSerializer(serializers.ModelSerializer):
    cliente = serializers.StringRelatedField()

    class Meta:
        model = Contacto
        fields = '__all__'

    # def create(self, validated_data):
    #     items_data = validated_data.pop('items')
    #     pedido = Pedido.objects.create(**validated_data)
    #     for item in items_data:
    #         ItemPedido.objects.create(pedido=pedido, **item)
    #     return pedido

class ItemPedidoCreateSerializer(serializers.ModelSerializer):
    producto = serializers.PrimaryKeyRelatedField(queryset=Producto.objects.all())

    class Meta:
        model = ItemPedido
        fields = ["producto", "cantidad", "precio_unitario"]

class PedidoCreateSerializer(serializers.ModelSerializer):
    items = ItemPedidoCreateSerializer(many=True)

    class Meta:
        model = Pedido
        fields = [
            "nombre",
            "direccion",
            "comuna",
            "telefono",
            "email",

            "estado",
            "metodo_pago",
            "total",
            "tipo_entrega",
            "items",
            "payment_id",
        ]
        extra_kwargs = {
            "payment_id": {"required": False},
        }

    def create(self, validated_data):
        items_data = validated_data.pop("items")

        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["cliente"] = request.user

        pedido = Pedido.objects.create(**validated_data)

        for item_data in items_data:
            ItemPedido.objects.create(pedido=pedido, **item_data)

        return pedido

