from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from .permissions import EsVendedor
from django.contrib.auth import authenticate
from .models import CustomUser
from .serializers import RegistroUsuarioSerializer, UsuarioSerializer
import random
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework import viewsets
from django.core.mail import EmailMultiAlternatives
# views.py
import random
from django.core.mail import send_mail
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import PasswordResetRequestSerializer, PasswordResetConfirmSerializer
from django.contrib.auth import get_user_model




User = get_user_model()

class SendResetCodeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Debes ingresar un correo"}, status=400)

        try:
            user = User.objects.get(email=email)

            code = random.randint(1000, 9999)
            user.key = code
            user.save()

            subject = "🔐 Recuperación de contraseña - WalunHub"
            from_email = settings.EMAIL_HOST_USER
            to = [email]

            html_content = f"""
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; 
                            background: #ffffff; border-radius: 12px; border: 1px solid #e6e6e6;">

                    <h2 style="color: #0e8a4f; text-align:center; margin-bottom: 20px;">
                        Recuperación de contraseña
                    </h2>

                    <p style="font-size: 15px; color:#333;">
                        Hola, <br><br>
                        Recibimos una solicitud para restablecer tu contraseña en <b>WalunHub</b>.
                    </p>

                    <div style="background:#f3fdf6; padding: 18px; text-align:center; 
                                border-radius: 10px; border: 1px solid #c8e6c9; margin: 25px 0;">
                        <p style="margin:0; font-size: 16px; color:#333;">
                            Tu código de verificación es:
                        </p>

                        <p style="font-size: 32px; margin: 10px 0; font-weight: bold; color:#0e8a4f;">
                            {code}
                        </p>
                    </div>

                    <p style="font-size: 15px; color:#333;">
                        Para continuar con el proceso, ingresa el código en el siguiente enlace:
                    </p>

                    <div style="text-align:center; margin: 25px 0;">
                        <a href="http://localhost:5173/recuperarpass2"
                           style="background:#0e8a4f; color:white; padding:12px 25px; 
                                  text-decoration:none; border-radius:8px; font-size:16px;">
                           Recuperar contraseña
                        </a>
                    </div>

                    <p style="font-size: 14px; color:#555;">
                        Si no solicitaste este cambio, puedes ignorar este mensaje sin problemas.
                    </p>

                    <br>

                    <p style="font-size: 14px; color:#999; text-align:center;">
                        — Equipo de Soporte de WalunHub 💚
                    </p>
                </div>
            """

            msg = EmailMultiAlternatives(subject, "", from_email, to)
            msg.attach_alternative(html_content, "text/html")
            msg.send()

            return Response({"message": "Código enviado correctamente"})

        except User.DoesNotExist:
            return Response({"error": "Correo no encontrado"}, status=404)




class PanelGestionView(APIView):
    permission_classes = [EsVendedor]

    def get(self, request):
        return Response({"message": "Bienvenido al panel de gestión"})


# Reestablecer Contraseña
class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        code = request.data.get("code")
        new_password = request.data.get("new_password")

        if not email or not code or not new_password:
            return Response({"error": "Faltan datos"}, status=400)

        try:
            user = User.objects.get(email=email, key=code)
            user.password = make_password(new_password) 
            user.key = None 
            user.save()
            return Response({"message": "Contraseña actualizada correctamente"})
        except User.DoesNotExist:
            return Response({"error": "Código inválido o correo incorrecto"}, status=400)

# Registro
class RegistroView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegistroUsuarioSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()

        subject = "🎉 ¡Bienvenido a WalunHub!"
        from_email = settings.EMAIL_HOST_USER
        to = [user.email]

        html_content = f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;
                        padding: 24px; background: #ffffff; border-radius: 12px; 
                        border: 1px solid #e6e6e6;">

                <h2 style="color: #0e8a4f; text-align:center; margin-bottom: 20px;">
                    ¡Tu cuenta ha sido creada con éxito!
                </h2>

                <p style="font-size: 15px; color:#333;">
                    Hola <b>{user.username}</b>,<br><br>
                    ¡Gracias por registrarte en <b>WalunHub</b>!  
                    Tu cuenta fue creada correctamente y ya puedes acceder a nuestra plataforma.
                </p>

                <div style="background:#f3fdf6; padding: 18px; border-radius: 10px; 
                            border: 1px solid #c8e6c9; margin: 25px 0;">
                    <p style="margin:0; font-size: 15px; color:#333;">
                        Aquí tienes un resumen de tu registro:
                    </p>

                    <p style="font-size: 15px; margin: 10px 0;">
                        <b>Email:</b> {user.email}<br>
                        <b>Usuario:</b> {user.username}
                    </p>
                </div>

                <div style="text-align:center; margin: 25px 0;">
                    <a href="http://localhost:5173/login"
                       style="background:#0e8a4f; color:white; padding:12px 25px; 
                              text-decoration:none; border-radius:8px; 
                              font-size:16px; display:inline-block;">
                       Iniciar sesión ahora
                    </a>
                </div>

                <p style="font-size: 14px; color:#555;">
                    Si tú no creaste esta cuenta, ignora este mensaje.
                </p>

                <br>

                <p style="font-size: 14px; color:#999; text-align:center;">
                    — Equipo de Soporte de WalunHub 💚
                </p>
            </div>
        """

        msg = EmailMultiAlternatives(subject, "", from_email, to)
        msg.attach_alternative(html_content, "text/html")
        msg.send()


# Login
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(request, email=email, password=password)
        if not user:
            return Response({"error": "Credenciales inválidas"}, status=400)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key})

# Logout
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        request.auth.delete()  # elimina el token actual
        return Response({"message": "Sesión cerrada"})

# Perfil
class PerfilView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)

class ActualizarPerfilView(generics.UpdateAPIView):
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class UsuarioAdminViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("username")
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]