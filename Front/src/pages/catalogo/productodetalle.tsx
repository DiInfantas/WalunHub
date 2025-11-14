import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Producto } from '../../interfaces/producto';
import { api } from '../../config/api';
import { agregarAlCarrito } from '../carrito/carritoUtils';
import toast, { Toaster } from "react-hot-toast";

function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    api.get(`/productos/${id}/`)
      .then(res => setProducto(res.data))
      .catch(() => setError("Producto no encontrado"));
  }, [id]);

  const handleAddToCart = () => {
    if (!producto) return;

    // validar token GOD shiet 
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Debes iniciar sesión para agregar al carrito");
      return;
    }

    agregarAlCarrito({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagenes[0]?.imagen || "/img/default.jpg",
      cantidad: cantidad,
      stock: producto.stock
    });

    toast.success("Producto agregado al carrito");
  };

  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>;
  if (!producto) return <p className="text-center mt-10">Cargando producto...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Toaster position="top-center" />

      <div className="grid md:grid-cols-2 gap-6">
        <img
          src={producto.imagenes[0]?.imagen || '/img/default.jpg'}
          alt={producto.nombre}
          className="w-full h-auto rounded shadow"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{producto.nombre}</h1>
          <p className="text-gray-700 mb-4">{producto.descripcion}</p>
          <p className="text-xl font-semibold text-green-700 mb-2">${producto.precio}</p>
          <p className="text-sm text-gray-600 mb-4">Stock disponible: {producto.stock}</p>

          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setCantidad(Math.max(1, cantidad - 1))}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              −
            </button>

            <span className="text-lg">{cantidad}</span>

            <button
              onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              disabled={cantidad >= producto.stock}
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;
