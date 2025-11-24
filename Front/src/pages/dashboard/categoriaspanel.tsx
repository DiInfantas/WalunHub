import { useEffect, useState } from "react";
import { api } from "../../config/api";
import { Toaster } from "react-hot-toast";
import { toastError, toastSuccess } from "../../interfaces/toast";

interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

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
            className="flex-1 bg-red-600 text-white py-2 rounded"
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

export default function CategoriasPanel() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState<number | null>(null);
  const [formulario, setFormulario] = useState({ nombre: "", descripcion: "" });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: number | null }>({
    open: false,
    id: null,
  });

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = () => {
    api
      .get("/categorias-admin/")
      .then((res) => setCategorias(res.data))
      .catch(() => toastError("Error al cargar categorías"))
      .finally(() => setLoading(false));
  };

  const abrirModalCrear = () => {
    setFormulario({ nombre: "", descripcion: "" });
    setModoEdicion(false);
    setCategoriaEditando(null);
    setMostrarModal(true);
  };

  const abrirModalEditar = (cat: Categoria) => {
    setFormulario({ nombre: cat.nombre, descripcion: cat.descripcion });
    setModoEdicion(true);
    setCategoriaEditando(cat.id);
    setMostrarModal(true);
  };

  const guardarCategoria = async () => {
    try {
      if (modoEdicion && categoriaEditando) {
        await api.put(`/categorias-admin/${categoriaEditando}/`, formulario);
      } else {
        await api.post("/categorias-admin/", formulario);
      }
      toastSuccess("Categoría guardada");
      setMostrarModal(false);
      cargarCategorias();
    } catch {
      toastError("Error al guardar categoría");
    }
  };

  const eliminarCategoria = (id: number) => {
    setDeleteModal({ open: true, id });
  };

  const confirmarEliminarCategoria = async () => {
    if (!deleteModal.id) return;

    try {
      await api.delete(`/categorias-admin/${deleteModal.id}/`);
      toastSuccess("Categoría eliminada");
      cargarCategorias();
    } catch {
      toastError("Error al eliminar categoría");
    } finally {
      setDeleteModal({ open: false, id: null });
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-green-600">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-700">Gestión de Categorías</h2>
        <button
          onClick={abrirModalCrear}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Nueva categoría
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando categorías...</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-white-600 text-green-700">
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Descripción</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.id} className="border-b">
                <td className="px-4 py-2">{cat.nombre}</td>
                <td className="px-4 py-2">{cat.descripcion}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => abrirModalEditar(cat)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => eliminarCategoria(cat.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {mostrarModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h3 className="text-xl font-bold text-green-700 mb-4">
              {modoEdicion ? "Editar categoría" : "Nueva categoría"}
            </h3>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nombre"
                value={formulario.nombre}
                onChange={(e) =>
                  setFormulario({ ...formulario, nombre: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded"
              />
              <textarea
                placeholder="Descripción"
                value={formulario.descripcion}
                onChange={(e) =>
                  setFormulario({ ...formulario, descripcion: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded"
              />
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setMostrarModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={guardarCategoria}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                {modoEdicion ? "Guardar cambios" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        open={deleteModal.open}
        title="Eliminar categoría"
        onConfirm={confirmarEliminarCategoria}
        onClose={() => setDeleteModal({ open: false, id: null })}
      >
        <p>¿Seguro que deseas eliminar esta categoría?</p>
      </Modal>

      <Toaster position="top-center" />
    </div>
  );
}
