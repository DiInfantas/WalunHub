from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User

class ImagenProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenProducto
        fields = ["id", "producto", "imagen"]

class ProductoSerializer(serializers.ModelSerializer):
    categoria = serializers.PrimaryKeyRelatedField(queryset=Categoria.objects.all())
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
            "peso_unitario",       
            "peso_total_item",     
            "subtotal",
        ]

    def get_subtotal(self, obj):
        return obj.cantidad * obj.precio_unitario



class PedidoSerializer(serializers.ModelSerializer):
    cliente = serializers.StringRelatedField()
    items = ItemPedidoSerializer(many=True)
    estado = serializers.StringRelatedField()
    estado_pago = serializers.StringRelatedField() 
    metodo_pago = serializers.StringRelatedField()

    class Meta:
        model = Pedido
        fields = "__all__"

class ContactoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contacto
        fields = ["id", "cliente", "nombre", "email", "mensaje", "fecha", "respondido"]
        read_only_fields = ["cliente", "fecha", "nombre", "email"]

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

        estado_pedido = EstadoPedido.objects.get(nombre="Esperando pago")
        estado_pago = EstadoPago.objects.get(nombre="Pendiente")

        validated_data["estado"] = estado_pedido
        validated_data["estado_pago"] = estado_pago

        if request and request.user.is_authenticated:
            validated_data["cliente"] = request.user
        else:
            validated_data["cliente"] = None

        pedido = Pedido.objects.create(**validated_data)

        for item_data in self.initial_data.get("items", []):
            item_serializer = ItemPedidoCreateSerializer(data=item_data)
            item_serializer.is_valid(raise_exception=True)
            item_serializer.save(pedido=pedido)


        total_peso = 0

        for item in pedido.items.all():
            raw_peso = item.producto.peso_kg or 0

            if isinstance(raw_peso, str):
                raw_peso = raw_peso.replace(",", ".")
                try:
                    peso = float(raw_peso)
                except:
                    peso = 0
            else:
                peso = float(raw_peso)

            total_peso += peso * item.cantidad

        pedido.peso_total = total_peso

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


class PedidoUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = ["estado", "estado_pago", "blue_code"]


