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

    if old_code != new_code and new_code is not None:
        email = instance.email or (instance.cliente.email if instance.cliente else None)
        if not email:
            return

        send_mail(
            subject=f"Código de envío actualizado - Pedido #{instance.id}",
            message=(
                f"Hola {instance.nombre},\n\n"
                f"Actualizamos tu código de seguimiento.\n\n"
                f"📦 Código BlueExpress: {new_code}\n\n"
                f"Puedes revisar tus pedidos aquí:\n"
                f"[-Tushar Cargar Web cuando esté en producción el Login-]\n\n"
                f"Rastrear tu envío directamente:\n"
                f"https://www.blue.cl/enviar/seguimiento?n_seguimiento={new_code}\n\n"
                f"¡Gracias por comprar con nosotros! 😎"
            ),
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False
        )


