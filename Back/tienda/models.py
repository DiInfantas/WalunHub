from django.db import models
from django.conf import settings
from decimal import Decimal

# Categoría
class Categoria(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.TextField(blank=True)

    def __str__(self):
        return self.nombre

# Producto
class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    precio = models.IntegerField()
    peso_kg = models.DecimalField(max_digits=8, decimal_places=3, default=Decimal("0.000"))
    stock = models.PositiveIntegerField(default=0)
    categoria = models.ForeignKey(Categoria, on_delete=models.RESTRICT, related_name='productos')
    destacado = models.BooleanField(default=False)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre

# Imagen de producto
class ImagenProducto(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name='imagenes')
    imagen = models.ImageField(upload_to='productos/', default='productos/default.jpg')

    def __str__(self):
        return f"Imagen de {self.producto.nombre}"

# Estado del pedido (logístico)
class EstadoPedido(models.Model):
    nombre = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.nombre

# Estado del pago (nuevo)
class EstadoPago(models.Model):
    nombre = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.nombre

# Método de pago
class MetodoPago(models.Model):
    nombre = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.nombre

# Pedido
class Pedido(models.Model):
    cliente = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    nombre = models.CharField(max_length=100, null=True, blank=True, default="")
    direccion = models.CharField(max_length=255, null=True, blank=True, default="")
    comuna = models.CharField(max_length=100, null=True, blank=True, default="")
    telefono = models.CharField(max_length=20, null=True, blank=True, default="")
    email = models.EmailField(null=True, blank=True, default="")

    estado = models.ForeignKey(EstadoPedido, on_delete=models.SET_NULL, null=True, related_name="pedidos")
    estado_pago = models.ForeignKey(EstadoPago, on_delete=models.SET_NULL, null=True, blank=True, related_name="pagos")
    metodo_pago = models.ForeignKey(MetodoPago, on_delete=models.SET_NULL, null=True)

    total = models.IntegerField()

    TIPO_ENTREGA_CHOICES = (
        ("delivery", "Delivery"),
        ("retiro", "Retiro en tienda"),
    )
    tipo_entrega = models.CharField(
        max_length=20,
        choices=TIPO_ENTREGA_CHOICES,
        default="delivery",
    )

    blue_code = models.IntegerField(null=True, blank=True)
    costo_envio_min = models.IntegerField(default=0)
    costo_envio_max = models.IntegerField(default=0)
    payment_id = models.CharField(max_length=200, null=True, blank=True)
    fecha = models.DateTimeField(auto_now_add=True)
    ticket_url = models.URLField(null=True, blank=True)

    def __str__(self):
        return f"Pedido #{self.id} - {self.nombre or 'Sin nombre'}"

# Detalle del pedido
class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='items', on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.PROTECT)
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.IntegerField()
    peso_unitario = models.DecimalField(max_digits=8, decimal_places=3, default=0)
    peso_total_item = models.DecimalField(max_digits=8, decimal_places=3, default=0)

    def __str__(self):
        return f'{self.producto.nombre} x {self.cantidad}'

# Estado del envío
class EstadoEnvio(models.Model):
    nombre = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.nombre

# Contacto
class Contacto(models.Model):
    cliente = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    nombre = models.CharField(max_length=100)
    email = models.EmailField()
    mensaje = models.TextField(max_length=1000)
    fecha = models.DateTimeField(auto_now_add=True)
    respondido = models.BooleanField(default=False)

    def __str__(self):
        return f'Mensaje de {self.nombre}'