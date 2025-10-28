import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Producto } from '../../interfaces/producto';
import { API_BASE_URL } from '../../config/api';

function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/productos/${id}/`)
      .then((res) => {
        if (!res.ok) throw new Error('Producto no encontrado');
        return res.json();
      })
      .then((data) => setProducto(data))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>;
  if (!producto) return <p className="text-center mt-10">Cargando producto...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
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
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;