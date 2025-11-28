import { useEffect, useState } from "react";
import { api } from "../../config/api";
import { Toaster } from "react-hot-toast";
import { toastError, toastSuccess } from "../../interfaces/toast";

interface Usuario {
  id: number;
  username: string;
  email: string;
  telefono: string;
  direccion: string;
  comuna: string;
  ciudad: string;
  codigo_postal: string;
  es_vendedor: boolean;
}

interface ModalProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

function ConfirmModal({ open, title, message, onConfirm, onClose }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
        <h2 className="text-xl font-bold mb-3">{title}</h2>

        <p className="mb-4">{message}</p>

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

export default function CuentasPanel() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = () => {
    api
      .get("/usuarios/usuarios-admin/")
      .then((res) => setUsuarios(res.data))
      .catch(() => toastError("Error al cargar usuarios"))
      .finally(() => setLoading(false));
  };

  const actualizarVendedor = (id: number, es_vendedor: boolean) => {
    const nombre =
      usuarios.find((u) => u.id === id)?.username || "este usuario";

    setModalMessage(
      `¿Estás seguro de que quieres ${
        es_vendedor ? "dar acceso a" : "revocar acceso de"
      } ${nombre}?`
    );

    setConfirmAction(() => async () => {
      try {
        await api.patch(`/usuarios/usuarios-admin/${id}/`, { es_vendedor });

        toastSuccess(
          es_vendedor
            ? `Acceso otorgado a ${nombre}`
            : `Acceso revocado de ${nombre}`
        );

        cargarUsuarios();
      } catch {
        toastError("Error al actualizar permiso");
      }

      setOpenConfirmModal(false);
    });

    setOpenConfirmModal(true);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-green-600">
      <h2 className="text-2xl font-bold text-green-700 mb-6">
        Gestión de Cuentas
      </h2>

      {loading ? (
        <p className="text-gray-600">Cargando usuarios...</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-green-100 text-green-700">
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Teléfono</th>
              <th className="px-4 py-2 text-left">Ciudad</th>
              <th className="px-4 py-2 text-left">¿Vendedor?</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="px-4 py-2">{u.username}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.telefono || "—"}</td>
                <td className="px-4 py-2">{u.ciudad || "—"}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-sm font-semibold ${
                      u.es_vendedor
                        ? "bg-green-200 text-green-700"
                        : "bg-red-200 text-red-700"
                    }`}
                  >
                    {u.es_vendedor ? "Sí" : "No"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => actualizarVendedor(u.id, !u.es_vendedor)}
                    className={`px-3 py-1 rounded text-white ${
                      u.es_vendedor
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {u.es_vendedor ? "Revocar acceso" : "Dar acceso"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Toaster position="top-center" />

      <ConfirmModal
        open={openConfirmModal}
        title="Confirmar acción"
        message={modalMessage}
        onConfirm={confirmAction}
        onClose={() => setOpenConfirmModal(false)}
      />
    </div>
  );
}
