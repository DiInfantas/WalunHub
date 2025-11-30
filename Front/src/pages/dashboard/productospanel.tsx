import { useEffect, useState } from "react";
import { api } from "../../config/api";
import { Toaster } from "react-hot-toast";
import { toastError, toastSuccess } from "../../interfaces/toast";

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  peso_kg: number;
  stock: number;
  categoria: number; // ← FIX: ahora es number
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

  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [productoEliminar, setProductoEliminar] = useState<number | null>(null);

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
      .catch(() => toastError("Error al cargar productos"))
      .finally(() => setLoading(false));
  };

  const cargarCategorias = () => {
    api
      .get("/categorias/")
      .then((res) => setCategorias(res.data))
      .catch(() => toastError("Error al cargar categorías"));
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
      categoria: String(producto.categoria),
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
      categoria: Number(formulario.categoria), // ← FIX
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

      toastSuccess("Producto guardado");
      setMostrarModal(false);
      setProductoEditando(null);
      setImagen(null);
      cargarProductos();
    } catch {
      toastError("Error al guardar producto");
    }
  };

  const abrirModalEliminarProducto = (id: number) => {
    setProductoEliminar(id);
    setMostrarModalEliminar(true);
  };

  const confirmarEliminarProducto = async () => {
    if (!productoEliminar) return;

    try {
      await api.delete(`/productos-admin/${productoEliminar}/`);
      toastSuccess("Producto eliminado");
      cargarProductos();
    } catch {
      toastError("Error al eliminar producto");
    }

    setMostrarModalEliminar(false);
    setProductoEliminar(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-green-600">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-700">Gestión de Productos</h2>
        <button
          onClick={abrirModalCrear}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Nuevo producto
        </button>
      </div>

      {/* Contenido */}
      {loading ? (
        <p className="text-gray-600">Cargando productos...</p>
      ) : (
        <div className="space-y-10">
          {categorias.map((categoria) => {
            const productosCategoria = productos.filter(
              (p) => p.categoria === categoria.id
            );

            if (productosCategoria.length === 0) return null;

            return (
              <div key={categoria.id}>
                <h3 className="text-xl font-bold text-green-700 mb-4">
                  {categoria.nombre}
                </h3>

                {/* GRID → 2 columnas en móvil, 4 en desktop */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                  {productosCategoria.map((producto) => (
                    <div
                      key={producto.id}
                      className="border border-green-300 rounded-xl shadow-sm p-3 bg-white hover:shadow-md transition"
                    >
                      {/* Imagen */}
                      {producto.imagenes?.[0]?.imagen ? (
                        <img
                          src={producto.imagenes[0].imagen}
                          alt={producto.nombre}
                          className="w-full h-28 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-28 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm">
                          Sin imagen
                        </div>
                      )}

                      {/* Info */}
                      <h4 className="font-semibold mt-2 text-sm">
                        {producto.nombre}
                      </h4>

                      <p className="text-green-700 font-bold text-sm">
                        ${producto.precio.toLocaleString()}
                      </p>

                      <p className="text-xs text-gray-500">Stock: {producto.stock}</p>

                      {/* Botones */}
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => abrirModalEditar(producto)}
                          className="flex-1 bg-blue-600 text-white py-1 rounded text-xs"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => abrirModalEliminarProducto(producto.id)}
                          className="flex-1 bg-red-600 text-white py-1 rounded text-xs"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL CREAR/EDITAR */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
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

      {/* MODAL ELIMINAR */}
      {mostrarModalEliminar && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-xl font-bold text-red-600 mb-4">
              Confirmar eliminación
            </h3>

            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setMostrarModalEliminar(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>

              <button
                onClick={confirmarEliminarProducto}
                className="px-4 py-2 bg-red-400 text-white rounded hover:bg-red-500"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-center" />
    </div>
  );
}
