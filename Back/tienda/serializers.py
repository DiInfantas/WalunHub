from rest_framework import serializers
from .models import (
    Categoria, Producto, ImagenProducto,
    EstadoPedido, MetodoPago, Pedido, ItemPedido,
    EstadoEnvio, Envio, Contacto
)
from django.contrib.auth.models import User

# Imagen de producto
class ImagenProductoSerializer(serializers.ModelSerializer):
    imagen = serializers.ImageField()

    class Meta:
        model = ImagenProducto
        fields = ['imagen']

# Producto
class ProductoSerializer(serializers.ModelSerializer):
    categoria = serializers.StringRelatedField()
    imagenes = ImagenProductoSerializer(many=True, read_only=True)

    class Meta:
        model = Producto
        fields = '__all__'

# Categoría
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

# Estado del pedido
class EstadoPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoPedido
        fields = '__all__'

# Método de pago
class MetodoPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MetodoPago
        fields = '__all__'

# Detalle del pedido
class ItemPedidoSerializer(serializers.ModelSerializer):
    producto = serializers.StringRelatedField()

    class Meta:
        model = ItemPedido
        fields = '__all__'

# Pedido
class PedidoSerializer(serializers.ModelSerializer):
    cliente = serializers.StringRelatedField()
    items = ItemPedidoSerializer(many=True)

    class Meta:
        model = Pedido
        fields = '__all__'

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        pedido = Pedido.objects.create(**validated_data)
        for item in items_data:
            ItemPedido.objects.create(pedido=pedido, **item)
        return pedido

# Estado del envío
class EstadoEnvioSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoEnvio
        fields = '__all__'

# Envío
class EnvioSerializer(serializers.ModelSerializer):
    pedido = serializers.StringRelatedField()

    class Meta:
        model = Envio
        fields = '__all__'

# Contacto
class ContactoSerializer(serializers.ModelSerializer):
    cliente = serializers.StringRelatedField()

    class Meta:
        model = Contacto
        fields = '__all__'