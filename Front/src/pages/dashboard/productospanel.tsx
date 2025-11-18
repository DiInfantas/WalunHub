import { useEffect, useState } from "react";
import { api } from "../../config/api";
import toast, { Toaster } from "react-hot-toast";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  peso_kg: number;
  stock: number;
  categoria: string;
  destacado: boolean;
  activo: boolean;
  imagenes: { id: number; imagen: string }[];
}

interface Categoria {
  id: number;
  nombre: string;
}

export default function ProductosPanel() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditando, setProductoEditando] = useState<number | null>(null);
  const [imagen, setImagen] = useState<File | null>(null);

  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    peso_kg: "",
    stock: "",
    categoria: "",
    destacado: false,
    activo: true,
  });

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  const cargarProductos = () => {
    api
      .get("/productos-admin/")
      .then((res) => setProductos(res.data))
      .catch(() => toast.error("Error al cargar productos"))
      .finally(() => setLoading(false));
  };

  const cargarCategorias = () => {
    api
      .get("/categorias/")
      .then((res) => setCategorias(res.data))
      .catch(() => toast.error("Error al cargar categorías"));
  };

  const abrirModalCrear = () => {
    setFormulario({
      nombre: "",
      descripcion: "",
      precio: "",
      peso_kg: "",
      stock: "",
      categoria: "",
      destacado: false,
      activo: true,
    });
    setImagen(null);
    setModoEdicion(false);
    setProductoEditando(null);
    setMostrarModal(true);
  };

  const abrirModalEditar = (producto: Producto) => {
    setFormulario({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: String(producto.precio),
      peso_kg: String(producto.peso_kg),
      stock: String(producto.stock),
      categoria: producto.categoria,
      destacado: producto.destacado,
      activo: producto.activo,
    });
    setImagen(null);
    setModoEdicion(true);
    setProductoEditando(producto.id);
    setMostrarModal(true);
  };

  const guardarProducto = async () => {
    const payload = {
      nombre: formulario.nombre,
      descripcion: formulario.descripcion,
      precio: parseFloat(formulario.precio),
      peso_kg: parseFloat(formulario.peso_kg),
      stock: parseInt(formulario.stock),
      categoria: formulario.categoria,
      destacado: formulario.destacado,
      activo: formulario.activo,
    };

    try {
      let productoId = productoEditando;

      if (modoEdicion && productoId) {
        await api.put(`/productos-admin/${productoId}/`, payload);
      } else {
        const res = await api.post("/productos-admin/", payload);
        productoId = res.data.id;
      }

      if (imagen && productoId) {
        const formData = new FormData();
        formData.append("producto", String(productoId));
        formData.append("imagen", imagen);
        await api.post("/imagenes-producto/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success("Producto guardado");
      setMostrarModal(false);
      setProductoEditando(null);
      setImagen(null);
      cargarProductos();
    } catch {
      toast.error("Error al guardar producto");
    }
  };

  const eliminarProducto = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      await api.delete(`/productos-admin/${id}/`);
      toast.success("Producto eliminado");
      cargarProductos();
    } catch {
      toast.error("Error al eliminar producto");
    }
  };
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-green-600">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-700">Gestión de Productos</h2>
        <button
          onClick={abrirModalCrear}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Nuevo producto
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando productos...</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-green-100 text-green-700">
              <th className="px-4 py-2 text-left">Imagen</th>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Precio</th>
              <th className="px-4 py-2 text-left">Stock</th>
              <th className="px-4 py-2 text-left">Categoría</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id} className="border-b">
                <td className="px-4 py-2">
                  {producto.imagenes?.[0]?.imagen ? (
                    <img
                      src={producto.imagenes[0].imagen}
                      alt="Producto"
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400 italic">Sin imagen</span>
                  )}
                </td>
                <td className="px-4 py-2">{producto.nombre}</td>
                <td className="px-4 py-2">${producto.precio.toLocaleString()}</td>
                <td className="px-4 py-2">{producto.stock}</td>
                <td className="px-4 py-2">{producto.categoria}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => abrirModalEditar(producto)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarProducto(producto.id)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg overflow-y-auto max-h-screen">
            <h3 className="text-xl font-bold text-green-700 mb-4">
              {modoEdicion ? "Editar producto" : "Crear nuevo producto"}
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
              <input
                type="number"
                placeholder="Precio"
                value={formulario.precio}
                onChange={(e) =>
                  setFormulario({ ...formulario, precio: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded"
              />
              <input
                type="number"
                placeholder="Peso (kg)"
                value={formulario.peso_kg}
                onChange={(e) =>
                  setFormulario({ ...formulario, peso_kg: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded"
              />
              <input
                type="number"
                placeholder="Stock"
                value={formulario.stock}
                onChange={(e) =>
                  setFormulario({ ...formulario, stock: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded"
              />
              <select
                value={formulario.categoria}
                onChange={(e) =>
                  setFormulario({ ...formulario, categoria: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded"
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files?.[0] || null)}
                className="w-full p-3 border border-gray-300 rounded"
              />
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formulario.destacado}
                    onChange={(e) =>
                      setFormulario({ ...formulario, destacado: e.target.checked })
                    }
                  />
                  <span>Destacado</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formulario.activo}
                    onChange={(e) =>
                      setFormulario({ ...formulario, activo: e.target.checked })
                    }
                  />
                  <span>Activo</span>
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setMostrarModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={guardarProducto}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                {modoEdicion ? "Guardar cambios" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-center" />
    </div>
  );
}