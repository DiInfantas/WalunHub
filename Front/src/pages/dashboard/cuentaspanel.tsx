import { useEffect, useState } from "react";
import { api } from "../../config/api";
import toast, { Toaster } from "react-hot-toast";

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

export default function CuentasPanel() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = () => {
    api
      .get("/usuarios/usuarios-admin/")
      .then((res) => setUsuarios(res.data))
      .catch(() => toast.error("Error al cargar usuarios"))
      .finally(() => setLoading(false));
  };

  const actualizarVendedor = async (id: number, es_vendedor: boolean) => {
    const nombre = usuarios.find((u) => u.id === id)?.username || "este usuario";

    const confirmar = window.confirm(
      `¿Estás seguro de que quieres ${es_vendedor ? "dar acceso a" : "revocar acceso de"} ${nombre}?`
    );

    if (!confirmar) return;

    try {
      await api.patch(`/usuarios/usuarios-admin/${id}/`, { es_vendedor });

      toast.success(
        es_vendedor
          ? `Acceso otorgado a ${nombre}`
          : `Acceso revocado de ${nombre}`
      );

      cargarUsuarios();
    } catch {
      toast.error("Error al actualizar permiso");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-yellow-600">
      <h2 className="text-2xl font-bold text-yellow-700 mb-6">Gestión de Cuentas</h2>

      {loading ? (
        <p className="text-gray-600">Cargando usuarios...</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-yellow-100 text-yellow-700">
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
                      u.es_vendedor ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
                    }`}
                  >
                    {u.es_vendedor ? "Sí" : "No"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => actualizarVendedor(u.id, !u.es_vendedor)}
                    className={`px-3 py-1 rounded text-white ${
                      u.es_vendedor ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
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
    </div>
  );
}