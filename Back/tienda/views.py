from rest_framework import viewsets, generics
from .models import (
    Producto, Categoria, Pedido, Contacto
)
from .serializers import (
    ProductoSerializer, CategoriaSerializer,
    PedidoSerializer, ContactoSerializer
)

# ViewSet para administración de productos (CRUD completo)
class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.filter(activo=True)
    serializer_class = ProductoSerializer

# Vista pública: lista de productos activos
class ProductoListView(generics.ListAPIView):
    queryset = Producto.objects.filter(activo=True)
    serializer_class = ProductoSerializer

# Vista pública: detalle de producto por ID
class ProductoDetailView(generics.RetrieveAPIView):
    queryset = Producto.objects.filter(activo=True)
    serializer_class = ProductoSerializer
    lookup_field = 'id'

# Vista pública: lista de categorías
class CategoriaListView(generics.ListAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

# Vista protegida: crear pedido
class PedidoCreateView(generics.CreateAPIView):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer

# Vista pública: enviar formulario de contacto
class ContactoCreateView(generics.CreateAPIView):
    queryset = Contacto.objects.all()
    serializer_class = ContactoSerializer