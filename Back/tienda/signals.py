print("Trackeo Tushar Tiempo REAL DIEGO GEI")
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import Pedido


@receiver(pre_save, sender=Pedido)
def enviar_email_cuando_blue_code_cambie(sender, instance, **kwargs):

    if not instance.pk:
        return

    try:
        old = Pedido.objects.get(pk=instance.pk)
    except Pedido.DoesNotExist:
        return

    old_code = old.blue_code
    new_code = instance.blue_code

    if old_code is None and new_code is not None:
        email = instance.email or (instance.cliente.email if instance.cliente else None)
        if not email:
            return

        send_mail(
            subject=f"Código de envío listo - Pedido #{instance.id}",
            message=(
                f"Hola {instance.nombre},\n\n"
                f"Ya registramos tu código de seguimiento en nuestro sistema.\n\n"
                f"📦 Código BlueExpress: {new_code}\n\n"
                f"Puedes ingresar a tu panel de usuario para ver todos tus pedidos:\n"
                f"https://tusitioweb.cl/login\n\n"
                f"Rastrear directamente tu envío:\n"
                f"https://www.blue.cl/enviar/seguimiento?n_seguimiento={new_code}\n\n"
                f"Gracias por comprar con nosotros 😎"
            ),
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False
        )

