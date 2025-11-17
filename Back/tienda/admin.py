from django.contrib import admin

from .models import (
    Categoria, Producto, ImagenProducto,
    EstadoPedido, MetodoPago, Pedido, ItemPedido,
    EstadoEnvio, Contacto
)

# Imágenes en línea dentro del producto
class ImagenProductoInline(admin.TabularInline):
    model = ImagenProducto
    extra = 1

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'precio', 'stock', 'categoria', 'activo', 'destacado')
    list_filter = ('categoria', 'activo', 'destacado')
    search_fields = ('nombre', 'descripcion')
    inlines = [ImagenProductoInline]

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion')
    search_fields = ('nombre',)

@admin.register(EstadoPedido)
class EstadoPedidoAdmin(admin.ModelAdmin):
    list_display = ('nombre',)
    search_fields = ('nombre',)

@admin.register(MetodoPago)
class MetodoPagoAdmin(admin.ModelAdmin):
    list_display = ('nombre',)
    search_fields = ('nombre',)

class ItemPedidoInline(admin.TabularInline):
    model = ItemPedido
    extra = 0

@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ('id', 'cliente', 'fecha', 'estado', 'metodo_pago', 'total', 'tipo_entrega')
    list_filter = ('estado', 'metodo_pago', 'tipo_entrega')
    search_fields = ('cliente__username', 'cliente__email')
    inlines = [ItemPedidoInline]

@admin.register(EstadoEnvio)
class EstadoEnvioAdmin(admin.ModelAdmin):
    list_display = ('nombre',)
    search_fields = ('nombre',)


@admin.register(Contacto)
class ContactoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'email', 'fecha', 'respondido')
    list_filter = ('respondido',)
    search_fields = ('nombre', 'email', 'mensaje')