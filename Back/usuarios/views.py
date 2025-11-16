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

# views.py
import random
from django.core.mail import send_mail
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import PasswordResetRequestSerializer, PasswordResetConfirmSerializer
from django.contrib.auth import get_user_model




User = get_user_model()
# Mandar Codigo Mail
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

            send_mail(
                subject="Recuperación de contraseña",
                message=(
                    "Hola,\n\n"
                    "Solicitaste recuperar tu contraseña.\n\n"
                    f"Tu código de verificación es: {code}\n\n"
                    "Para continuar, ingresa al siguiente enlace:\n"
                    "http://localhost:5173/recuperarpass2\n\n"
                    "Si no solicitaste este cambio, simplemente ignora este mensaje.\n\n"
                    "Saludos,\n"
                    "Equipo de Soporte de WalunHub"
                ),
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
            )

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
            user.password = make_password(new_password)  # encripta la nueva contraseña
            user.key = None  # limpiar el código
            user.save()
            return Response({"message": "Contraseña actualizada correctamente"})
        except User.DoesNotExist:
            return Response({"error": "Código inválido o correo incorrecto"}, status=400)

# Registro
class RegistroView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegistroUsuarioSerializer
    permission_classes = [permissions.AllowAny]

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
