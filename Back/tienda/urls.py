from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoriaListView, CategoriaViewSet, EnviarContactoView,
    ImagenProductoViewSet, PedidoAdminListView, PedidoCreateView,
    PedidoListView, ProductoDetailView, ProductoListView,
    ProductoViewSet, actualizar_estado_pago, create_payment_preference,
    mp_webhook, listar_estados_pedido, listar_estados_pago,
    PedidoRetrieveUpdateView, ContactoListView, ContactoUpdateView # 👈 vista unificada para GET y PATCH
)

router = DefaultRouter()
router.register(r'productos-admin', ProductoViewSet)
router.register(r'imagenes-producto', ImagenProductoViewSet)
router.register(r'categorias-admin', CategoriaViewSet)

urlpatterns = [
    path('api/', include(router.urls)),

    # Productos y categorías
    path('api/productos/', ProductoListView.as_view()),
    path('api/productos/<int:id>/', ProductoDetailView.as_view()),
    path('api/categorias/', CategoriaListView.as_view()),

    # Pedidos
    path('api/pedidos/', PedidoCreateView.as_view()),
    path('api/pedidos/mis/', PedidoListView.as_view()),
    path('api/pedidos/<int:id>/', PedidoRetrieveUpdateView.as_view()),
    path('api/pedidos-admin/', PedidoAdminListView.as_view()),

    # Contacto
    path('api/contacto/enviar/', EnviarContactoView.as_view(), name='enviar-contacto'),
    path("api/contactos/", ContactoListView.as_view(), name="contacto-list"),
    path("api/contactos/<int:id>/", ContactoUpdateView.as_view(), name="contacto-update"),

    # MercadoPago
    path('api/create_preference/', create_payment_preference),
    path('api/update_pedido_pago/', actualizar_estado_pago),
    path('api/mp/webhook', mp_webhook),
    path('api/mp/webhook/', mp_webhook),

    # Estados dinámicos
    path('api/estados-pedido/', listar_estados_pedido),
    path('api/estados-pago/', listar_estados_pago),
]