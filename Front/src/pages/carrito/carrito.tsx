import { useEffect, useState } from 'react';
import type { ItemCarrito } from "../../interfaces/itemCarrito";
import {
  obtenerCarrito,
  guardarCarrito,
  eliminarDelCarrito,
  vaciarCarrito,
} from './carritoUtils';
import { Link } from 'react-router-dom';

export default function Carrito() {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

  useEffect(() => {
    setCarrito(obtenerCarrito());
  }, []);

  const actualizarCantidad = (id: number, cantidad: number) => {
    const actualizado = carrito.map((item) =>
      item.id === id 
        ? { ...item, cantidad: Math.max(1, Math.min(item.stock, cantidad)) } 
        : item
    );
    setCarrito(actualizado);
    guardarCarrito(actualizado);
  };

  const eliminarProducto = (id: number) => {
    eliminarDelCarrito(id);
    setCarrito(obtenerCarrito());
  };

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  if (carrito.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío 🛒</h2>
        <Link to="/catalogo" className="text-green-600 hover:underline font-semibold">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">Tu carrito</h2>

      <div className="space-y-6">
        {carrito.map((item) => (
          <div key={item.id} className="flex items-center gap-4 border-b pb-4">
            <img
              src={item.imagen || '/img/default.jpg'}
              alt={item.nombre}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{item.nombre}</h3>
              <p className="text-sm text-gray-600">${item.precio} /kg</p>
              <div className="flex items-center mt-2 gap-2">
                <button
                  onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                  className="px-2 py-1 bg-gray-200 rounded"
                  disabled={item.cantidad <= 1}
                >
                  −
                </button>
                <span className="px-3">{item.cantidad}</span>
                <button
                  onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                  className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                  disabled={item.cantidad >= item.stock}
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold">${item.precio * item.cantidad}</p>
              <button
                onClick={() => eliminarProducto(item.id)}
                className="text-red-500 text-sm hover:underline mt-1"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-right">
        <p className="text-xl font-bold mb-4">Total: ${total.toFixed(0)}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => {
              vaciarCarrito();
              setCarrito([]);
            }}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            Vaciar carrito
          </button>
          <Link
            to="/checkout"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded"
          >
            Ir al checkout
          </Link>
        </div>
      </div>
    </section>
  );
}