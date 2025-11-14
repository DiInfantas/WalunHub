import { useState } from "react";
import { resetPassword } from "../../config/api";
import toast, { Toaster } from "react-hot-toast";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    const confirmChange = confirm(
      "¿Estás seguro que quieres usar esta nueva contraseña?"
    );
    if (!confirmChange) return;

    setLoading(true);
    setMessage("");

    try {
      const data = await resetPassword(email, code, newPassword);

      setMessage(data.message || "Contraseña actualizada correctamente");

      toast.success("Tu contraseña ha sido cambiada exitosamente.", {
        duration: 15000,
        position: "top-center",
      });

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);

    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error || "Error al actualizar contraseña";

      setMessage(errorMsg);

      alert(errorMsg);

      toast.error(errorMsg, {
        duration: 3000,
        position: "top-center",
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4 p-6">
        <h1 className="text-xl font-bold">Reestablecer contraseña</h1>

        <input
          type="text"
          placeholder="Código"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border p-2 rounded w-64"
        />

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded w-64"
        />

        <div className="relative w-64">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border p-2 rounded w-full pr-10"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Actualizando..." : "Actualizar contraseña"}
        </button>

        {message && <p className="text-sm text-gray-700">{message}</p>}
      </div>

      <Toaster />
    </>
  );
}
