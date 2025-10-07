from rest_framework import serializers
from .models import Producto, Categoria, ImagenProducto

class ImagenProductoSerializer(serializers.ModelSerializer):
    imagen = serializers.ImageField()

    class Meta:
        model = ImagenProducto
        fields = ['imagen']

class ProductoSerializer(serializers.ModelSerializer):
    categoria = serializers.StringRelatedField()
    imagenes = ImagenProductoSerializer(many=True, read_only=True)

    class Meta:
        model = Producto
        fields = '__all__'