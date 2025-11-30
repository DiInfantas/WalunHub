import { useEffect, useState } from "react";
import {
  api,
  editarUsuarioAdmin,
  eliminarUsuarioAdmin,
} from "../../config/api";
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

function ConfirmModal({ open, title, message, onConfirm, onClose }: any) {
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

function EditUsuarioModal({ open, usuario, onClose, onSave }: any) {
  if (!open || !usuario) return null;

  const [form, setForm] = useState({ ...usuario });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const campos = [
    "username",
    "email",
    "telefono",
    "direccion",
    "comuna",
    "ciudad",
    "codigo_postal",
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>

        <div className="flex flex-col gap-3">
          {campos.map((field) => (
            <input
              key={field}
              name={field}
              value={(form as any)[field] || ""}
              onChange={handleChange}
              placeholder={field}
              className="border p-2 rounded"
            />
          ))}
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => onSave(form)}
            className="flex-1 bg-green-600 text-white py-2 rounded"
          >
            Guardar
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white py-2 rounded"
          >
            Cancelar
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
  const [confirmAction, setConfirmAction] = useState(() => {});
  const [openEditModal, setOpenEditModal] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState<Usuario | null>(null);

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
    const nombre = usuarios.find((u) => u.id === id)?.username || "este usuario";

    setModalMessage(
      `¿Estás seguro de que quieres ${
        es_vendedor ? "otorgar" : "revocar"
      } acceso de vendedor a ${nombre}?`
    );

    setConfirmAction(() => async () => {
      try {
        await api.patch(`/usuarios/usuarios-admin/${id}/`, { es_vendedor });

        toastSuccess(
          es_vendedor
            ? `Acceso otorgado a ${nombre}`
            : `Acceso revocado a ${nombre}`
        );

        cargarUsuarios();
      } catch {
        toastError("Error al actualizar permiso");
      }

      setOpenConfirmModal(false);
    });

    setOpenConfirmModal(true);
  };

  const abrirEditarUsuario = (u: Usuario) => {
    setUsuarioEdit(u);
    setOpenEditModal(true);
  };

  const guardarUsuario = async (data: any) => {
    try {
      await editarUsuarioAdmin(usuarioEdit!.id, data);

      toastSuccess("Usuario actualizado correctamente");
      setOpenEditModal(false);
      cargarUsuarios();
    } catch {
      toastError("Error al actualizar usuario");
    }
  };

  const borrarUsuario = (id: number) => {
    setModalMessage(
      "¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer."
    );

    setConfirmAction(() => async () => {
      try {
        await eliminarUsuarioAdmin(id);
        toastSuccess("Usuario eliminado");

        cargarUsuarios();
      } catch {
        toastError("Error al eliminar usuario");
      }

      setOpenConfirmModal(false);
    });

    setOpenConfirmModal(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-green-600">
      <h2 className="text-2xl font-bold text-green-700 mb-6">
        Gestión de Cuentas
      </h2>

      {loading ? (
        <p className="text-gray-600">Cargando usuarios...</p>
      ) : (
        <div
          className="
            grid gap-4 
            grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-3
          "
        >
          {usuarios.map((u) => (
            <div
              key={u.id}
              className="border rounded-lg p-4 shadow-md bg-green-50 border-green-300"
            >
              <h3 className="text-lg font-semibold text-green-700 flex justify-between">
                {u.username}
                <span
                  className={`text-sm px-2 py-1 rounded ${
                    u.es_vendedor
                      ? "bg-green-200 text-green-700"
                      : "bg-red-200 text-red-700"
                  }`}
                >
                  {u.es_vendedor ? "Vendedor" : "Cliente"}
                </span>
              </h3>

              <p className="text-gray-700 text-sm">{u.email}</p>

              <div className="mt-2 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Teléfono: </span>
                  {u.telefono || "—"}
                </p>
                <p>
                  <span className="font-semibold">Ciudad: </span>
                  {u.ciudad || "—"}
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={() => actualizarVendedor(u.id, !u.es_vendedor)}
                  className={`py-2 rounded text-white text-sm ${
                    u.es_vendedor ? "bg-red-600" : "bg-green-600"
                  }`}
                >
                  {u.es_vendedor ? "Revocar acceso" : "Dar acceso"}
                </button>

                <button
                  onClick={() => abrirEditarUsuario(u)}
                  className="py-2 rounded bg-blue-600 text-white text-sm"
                >
                  Editar
                </button>

                <button
                  onClick={() => borrarUsuario(u.id)}
                  className="py-2 rounded bg-gray-600 text-white text-sm"
                >
                  Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Toaster position="top-center" />

      <ConfirmModal
        open={openConfirmModal}
        title="Confirmar acción"
        message={modalMessage}
        onConfirm={confirmAction}
        onClose={() => setOpenConfirmModal(false)}
      />

      <EditUsuarioModal
        open={openEditModal}
        usuario={usuarioEdit}
        onClose={() => setOpenEditModal(false)}
        onSave={guardarUsuario}
      />
    </div>
  );
}
