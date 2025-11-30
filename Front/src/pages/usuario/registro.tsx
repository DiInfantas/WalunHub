import { useState } from "react";
import { api } from "../../config/api";
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

export default function Registro() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  // Validación de contraseña
  const validarFormulario = () => {
    if (password.length < 8) {
      toastError("La contraseña debe tener al menos 8 caracteres.");
      return false;
    }
    if (password !== confirmPassword) {
      toastError("Las contraseñas no coinciden.");
      return false;
    }
    return true;
  };

  const handleSubmitFinal = async () => {
    try {
      await api.post("/usuarios/registro/", { username, email, password });
      toastSuccess("Cuenta creada con éxito");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    } catch (err: any) {
      console.error(err.response?.data);
      const msg = "Error al crear la cuenta";
      toastError(msg);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    setModalOpen(true);
  };

  const handleConfirmModal = () => {
    setModalOpen(false);
    handleSubmitFinal();
  };

  return (
    <>
      <Modal
        open={modalOpen}
        title="Confirmación"
        onConfirm={handleConfirmModal}
        onClose={() => setModalOpen(false)}
      >
        <p>¿Estás seguro de usar esta contraseña?</p>
      </Modal>

      <div className="container px-4 mx-auto py-12">
        <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
            Crear cuenta
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">
                Nombre completo
              </label>
              <input
                type="text"
                value={username}
                placeholder="Ingresa tu nombre aquí"
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 border-2 border-green-600 rounded"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                placeholder="correo@mail.com"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border-2 border-green-600 rounded"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 border-2 border-green-600 rounded pr-12"
                  placeholder="Mínimo 8 caracteres"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-4 border-2 border-green-600 rounded pr-12"
                  placeholder="Repite la contraseña"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 text-white font-bold bg-green-600 hover:bg-green-700 rounded"
            >
              Registrarse
            </button>
          </form>
        </div>
      </div>

      <Toaster position="top-center" />
    </>
  );
}
