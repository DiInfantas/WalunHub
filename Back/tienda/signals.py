from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from .models import Pedido
from .models import Pedido, EstadoPedido



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

        subject = f"Código de envío actualizado - Pedido #{instance.id}"
        from_email = settings.EMAIL_HOST_USER
        to = [email]

        seguimiento_url = f"https://www.blue.cl/enviar/seguimiento?n_seguimiento={new_code}"

        html_content = f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;
                        padding: 24px; background: #ffffff; border-radius: 12px; 
                        border: 1px solid #e6e6e6;">

                <h2 style="color:#0e8a4f; text-align:center; margin-bottom: 25px;">
                    🛫 ¡Tu codigo de seguimiento del envío!
                </h2>

                <p style="font-size: 15px; color:#333;">
                    Hola <b>{instance.nombre}</b>,<br><br>
                    Actualizamos tu código de seguimiento de <b>BlueExpress</b>.
                </p>

                <div style="background:#f3fdf6; padding: 18px; border-radius: 10px; 
                            border: 1px solid #c8e6c9; margin: 25px 0; text-align:center;">
                    <p style="margin:0; font-size: 16px; color:#333;">
                        Tu nuevo código de seguimiento es:
                    </p>

                    <p style="font-size: 28px; margin: 10px 0; font-weight:bold; color:#0e8a4f;">
                        {new_code}
                    </p>
                </div>

                <p style="font-size: 15px; color:#333;">
                    Puedes rastrear tu envío directamente en BlueExpress:
                </p>

                <div style="text-align:center; margin: 20px 0;">
                    <a href="{seguimiento_url}"
                       style="background:#0e8a4f; color:white; padding:12px 25px; 
                              text-decoration:none; border-radius:8px; font-size:16px;">
                       Rastrear mi pedido
                    </a>
                </div>

                <p style="font-size: 15px; color:#333; margin-top: 25px;">
                    También puedes revisar tus pedidos desde tu panel:
                </p>

                <p style="font-size: 14px; color:#555; text-align:center;">
                    <a href="https://26jw2jkc-5173.brs.devtunnels.ms/perfil"
                    style="color:#0e8a4f; font-weight:bold; text-decoration:none;">
                    Ir al panel de pedidos
                    </a>
                </p>

                <br>

                <p style="font-size: 14px; color:#999; text-align:center;">
                    — Gracias por comprar con <b>WalunGranel</b> 💚
                </p>
            </div>
        """

        msg = EmailMultiAlternatives(subject, "", from_email, to)
        msg.attach_alternative(html_content, "text/html")
        msg.send()


@receiver(pre_save, sender=Pedido)
def enviar_email_cuando_este_listo_para_retiro(sender, instance, **kwargs):

    if not instance.pk:
        return

    try:
        old = Pedido.objects.get(pk=instance.pk)
    except Pedido.DoesNotExist:
        return

    estado_anterior = old.estado.nombre if old.estado else None
    estado_nuevo = instance.estado.nombre if instance.estado else None

    if estado_anterior != estado_nuevo and estado_nuevo == "Esperando retiro":

        email = instance.email or (instance.cliente.email if instance.cliente else None)
        if not email:
            return

        subject = f"Tu pedido #{instance.id} está listo para ser retirado"
        from_email = settings.EMAIL_HOST_USER
        to = [email]

        panel_url = "https://26jw2jkc-5173.brs.devtunnels.ms/perfil"

        items_html = ""
        for item in instance.items.all():
            items_html += f"""
                <tr>
                    <td style="padding: 6px 10px;">{item.producto.nombre}</td>
                    <td style="padding: 6px 10px; text-align:center;">{item.cantidad}</td>
                    <td style="padding: 6px 10px;">${item.precio_unitario}</td>
                </tr>
            """

        html_content = f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;
                        padding: 24px; background: #ffffff; border-radius: 12px; 
                        border: 1px solid #e6e6e6;">

                <h2 style="color:#0e8a4f; text-align:center;">
                    🛍️ ¡Tu pedido está listo para retiro!
                </h2>

                <p style="font-size: 15px; color:#333;">
                    Hola <b>{instance.nombre}</b>,<br><br>
                    Tu pedido <b>#{instance.id}</b> ya está listo para ser retirado en nuestra sucursal.
                </p>

                <!-- Dirección -->
                <div style="background:#f3fdf6; padding: 18px; border-radius: 10px; 
                            border: 1px solid #c8e6c9; margin: 25px 0;">
                    <p style="margin:0; font-size: 15px; color:#333;">
                        📍 Dirección de retiro:
                    </p>

                    <p style="font-size: 20px; font-weight:bold; margin-top:5px; color:#0e8a4f;">
                        Portugal 87, Santiago Centro
                    </p>

                    <div style="text-align:center; margin-top:15px;">
                        <a href="https://www.google.com/maps/search/?api=1&query=Portugal+87,+Santiago+Centro"
                           style="background:#0e8a4f; color:white; padding:12px 25px; 
                                  text-decoration:none; border-radius:8px; font-size:16px;">
                           Ver en Google Maps
                        </a>
                    </div>
                </div>

                <!-- Tabla de productos -->
                <h3 style="color:#0e8a4f;">🧾 Productos del pedido</h3>

                <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
                    <thead>
                        <tr style="background:#f3f3f3;">
                            <th style="padding: 6px 10px; text-align:left;">Producto</th>
                            <th style="padding: 6px 10px; text-align:center;">Cant.</th>
                            <th style="padding: 6px 10px; text-align:left;">Precio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items_html}
                    </tbody>
                </table>

                <p style="font-size: 16px; margin-top: 15px; color:#333;">
                    <b>Total:</b> ${instance.total:,}
                </p>

                <!-- Botón a panel -->
                <div style="text-align:center; margin: 30px 0;">
                    <a href="{panel_url}"
                       style="background:#0e8a4f; color:white; padding:12px 25px; 
                              text-decoration:none; border-radius:8px; font-size:16px;">
                       Ver detalles del pedido
                    </a>
                </div>

                <br>

                <p style="font-size: 14px; color:#999; text-align:center;">
                    — Gracias por comprar con <b>WalunGranel</b> 💚
                </p>
            </div>
        """

        msg = EmailMultiAlternatives(subject, "", from_email, to)
        msg.attach_alternative(html_content, "text/html")
        msg.send()






