from django.urls import path
from .views import RegistroView, PanelGestionView, LoginView, LogoutView, PerfilView, SendResetCodeView, ActualizarPerfilView, ResetPasswordView

urlpatterns = [
    path("registro/", RegistroView.as_view(), name="registro"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("perfil/", PerfilView.as_view(), name="perfil"),
    path("panel/", PanelGestionView.as_view(), name="panel-gestion"),
    path("send-reset-code/", SendResetCodeView.as_view(), name="send_reset_code"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset_password"),
    path("perfil/actualizar/", ActualizarPerfilView.as_view(), name="actualizar-perfil"),
]


