import { useState } from "react";
import { resetPassword } from "../../config/api";
import { Toaster } from "react-hot-toast";
import { toastError, toastSuccess } from "../../interfaces/toast";

interface ModalProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onConfirm: () => void;
  onClose: () => void;
}

function Modal({ open, title, children, onConfirm, onClose }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
        <h2 className="text-xl font-bold mb-3">{title}</h2>

        <div className="mb-4">{children}</div>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-green-600 text-white py-2 rounded"
          >
            Sí
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white py-2 rounded"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [confirmModal, setConfirmModal] = useState(false);

  const handleSubmit = async () => {
    if (!email || !code || !newPassword) {
      toastError("Todos los campos son obligatorios");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const data = await resetPassword(email, code, newPassword);
      setMessage(data.message || "Contraseña actualizada correctamente");

      toastSuccess("Tu contraseña ha sido cambiada exitosamente.");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error || "Error al actualizar contraseña";
      setMessage(errorMsg);
      toastError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4 p-6">
        <h1 className="text-xl font-bold">Reestablecer contraseña</h1>

        <p className="text-sm text-gray-600 text-center max-w-xs">
          Ingresa el código que recibiste por correo y tu nueva contraseña para completar el proceso.
        </p>

        <input
          type="text"
          placeholder="Código"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border p-2 rounded w-64"
        />

        <input
          type="email"
          placeholder="Tu correo"
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
          onClick={() => setConfirmModal(true)}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Actualizando..." : "Actualizar contraseña"}
        </button>

        {message && <p className="text-sm text-gray-700">{message}</p>}
      </div>

      <Modal
        open={confirmModal}
        title="Confirmar cambio"
        onConfirm={() => {
          setConfirmModal(false);
          handleSubmit();
        }}
        onClose={() => setConfirmModal(false)}
      >
        <p>¿Estás seguro que quieres usar esta nueva contraseña?</p>
      </Modal>

      <Toaster />
    </>
  );
}


