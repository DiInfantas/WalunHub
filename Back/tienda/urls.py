from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductoViewSet,
    ProductoListView, ProductoDetailView,
    CategoriaListView,
    PedidoCreateView,
    ContactoCreateView
)

# Router para ViewSet (productos con CRUD completo si lo usas)
router = DefaultRouter()
router.register(r'productos-admin', ProductoViewSet)  # solo si usas ViewSet para admin

urlpatterns = [
    path('api/', include(router.urls)),

    # Productos públicos
    path('api/productos/', ProductoListView.as_view(), name='producto-list'),
    path('api/productos/<int:id>/', ProductoDetailView.as_view(), name='producto-detail'),

    # Categorías
    path('api/categorias/', CategoriaListView.as_view(), name='categoria-list'),

    # Pedidos
    path('api/pedidos/', PedidoCreateView.as_view(), name='pedido-create'),

    # Contacto
    path('api/contacto/', ContactoCreateView.as_view(), name='contacto-create'),
]