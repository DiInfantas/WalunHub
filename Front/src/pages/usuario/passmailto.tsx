import { useState } from "react";
import { requestResetCode } from "../../config/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      const data = await requestResetCode(email);
      const fullMessage =
        (data.message || "Código enviado correctamente") +
        ". Revisa tu bandeja del correo ingresado.";

      setMessage(fullMessage);

      alert(
        "Se ha enviado un correo con el código de recuperación.\n" +
          "Revisa tu bandeja de entrada."
      );

      setTimeout(() => {
        window.location.href = "/";
      }, 2000);

    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Error al enviar código";
      setMessage(errorMsg);
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h1 className="text-xl font-bold">Recuperar contraseña</h1>

      <input
        type="email"
        placeholder="Ingresa tu correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded w-64"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Enviar código"}
      </button>

      {message && <p className="text-sm text-gray-700">{message}</p>}
    </div>
  );
}
