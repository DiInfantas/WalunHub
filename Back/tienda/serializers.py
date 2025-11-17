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
    producto = ProductoSerializer(read_only=True)  
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = ItemPedido
        fields = [
            "id",
            "producto",
            "cantidad",
            "precio_unitario",
            "subtotal",
        ]

    def get_subtotal(self, obj):
        return obj.cantidad * obj.precio_unitario


class PedidoSerializer(serializers.ModelSerializer):
    cliente = serializers.StringRelatedField()
    items = ItemPedidoSerializer(many=True)
    estado = serializers.StringRelatedField()
    metodo_pago = serializers.StringRelatedField()   


    class Meta:
        model = Pedido
        fields = "__all__"


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
            "id",
            "nombre",
            "direccion",
            "comuna",
            "telefono",
            "email",
            "estado",
            "metodo_pago",
            "total",
            "tipo_entrega",
            "costo_envio",
            "peso_total",
            "items",
            "payment_id",
        ]
        read_only_fields = ["costo_envio", "peso_total", "payment_id"]

    def create(self, validated_data):
        items_data = validated_data.pop("items")

        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["cliente"] = request.user

        pedido = Pedido.objects.create(**validated_data)

        for item_data in items_data:
            ItemPedido.objects.create(pedido=pedido, **item_data)

        return pedido

