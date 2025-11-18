from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *


router = DefaultRouter()
router.register(r'productos-admin', ProductoViewSet)
router.register(r'imagenes-producto', ImagenProductoViewSet)

urlpatterns = [
    path('api/', include(router.urls)),

    path('api/productos/', ProductoListView.as_view()),
    path('api/productos/<int:id>/', ProductoDetailView.as_view()),

    path('api/categorias/', CategoriaListView.as_view()),

    path('api/pedidos/', PedidoCreateView.as_view()),

    path("api/pedidos/mis/", PedidoListView.as_view()),
    path("api/pedidos/<int:pk>/", PedidoDetailView.as_view()),

    path("api/contacto/enviar/", EnviarContactoView.as_view(), name="enviar-contacto"),
    # mercadopago_tushar
    path("api/create_preference/", create_payment_preference),
    path("api/update_pedido_pago/", actualizar_estado_pago),
    path("api/mp/webhook", mp_webhook),
    path("api/mp/webhook/", mp_webhook),


]


