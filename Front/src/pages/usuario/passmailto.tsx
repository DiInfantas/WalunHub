import { useState } from "react";
import { requestResetCode } from "../../config/api";
import { Toaster } from "react-hot-toast";
import { toastError, toastSuccess } from "../../interfaces/toast";



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

      toastSuccess("Código enviado correctamente. Revisa tu correo.");

    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Error al enviar código";
      setMessage(errorMsg);
      toastError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4 p-6">
        <h1 className="text-xl font-bold">Recuperar contraseña</h1>

        <p className="text-sm text-gray-600 text-center max-w-xs">
          Ingresa tu correo electrónico y te enviaremos un código para que puedas restablecer tu contraseña.
        </p>

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

      <Toaster position="top-center" />
    </>
  );
}