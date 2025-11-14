from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # Email será el identificador único
    email = models.EmailField(unique=True)

    # Nombre completo (no único)
    username = models.CharField(max_length=150, blank=True, null=True)

    # Campos adicionales
    telefono = models.CharField(max_length=20, blank=True, null=True)
    direccion = models.CharField(max_length=200, blank=True, null=True)
    comuna = models.CharField(max_length=100, blank=True, null=True)
    ciudad = models.CharField(max_length=100, blank=True, null=True)
    codigo_postal = models.CharField(max_length=20, blank=True, null=True)
    es_vendedor = models.BooleanField(default=False)
    key = models.IntegerField(blank=True, null=True)


    USERNAME_FIELD = 'email'          # login con correo
    REQUIRED_FIELDS = ['username']    # nombre completo requerido al registrar

    def __str__(self):
        return f"{self.username or ''} ({self.email})"
