from django.urls import path
from .views import RegistroView, LoginView, LogoutView, PerfilView, SendResetCodeView, ResetPasswordView

urlpatterns = [
    path("registro/", RegistroView.as_view(), name="registro"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("perfil/", PerfilView.as_view(), name="perfil"),

    path("send-reset-code/", SendResetCodeView.as_view(), name="send_reset_code"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset_password")
]


