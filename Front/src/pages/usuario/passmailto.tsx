import { useState } from "react";
import { requestResetCode } from "../../config/api";
import toast, { Toaster } from "react-hot-toast";

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

      toast.custom(
        (t) => (
          <div className="bg-white shadow-lg border border-gray-300 p-4 rounded-md flex flex-col items-center gap-2">
            <p className="font-semibold text-green-700 text-center">
              Código enviado correctamente
            </p>
            <p className="text-sm text-gray-600 text-center">
              Revisa tu bandeja de entrada.
            </p>

            <button
              onClick={() => {
                toast.dismiss(t.id); 
                window.location.href = "/";
              }}
              className="mt-2 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Aceptar
            </button>
          </div>
        ),
        { duration: 5000, position: "top-center" }
      );

    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Error al enviar código";
      setMessage(errorMsg);

      alert(errorMsg);

      toast.error(errorMsg, { duration: 4000, position: "top-center" });

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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

      <Toaster position="top-center" />
    </>
  );
}
