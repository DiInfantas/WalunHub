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
    const actualizado = carrito.map((item) => {
      if (item.id !== id) return item;

      const nuevaCantidad = Math.min(
        Math.max(1, cantidad), 
        item.stock
      );

      return { ...item, cantidad: nuevaCantidad };
    });

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
      <div className="text-center py-20 px-6">
        <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío 🛒</h2>
        <Link to="/catalogo" className="text-green-600 hover:underline font-semibold">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
        Tu carrito
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {carrito.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col p-4"
          >
            <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={item.imagen || '/img/default.jpg'}
                alt={item.nombre}
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
            </div>

            <div className="flex flex-col flex-grow mt-3">
              <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                {item.nombre}
              </h3>

              <p className="text-sm text-gray-600 mt-1">
                Bolsa de {item.peso_kg} kg
              </p>

              <p className="text-xl font-bold text-green-700 mt-2">
                ${item.precio * item.cantidad}
              </p>

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                  className="px-3 py-1 bg-gray-200 rounded text-lg disabled:opacity-50"
                  disabled={item.cantidad <= 1}
                >
                  −
                </button>
                <span className="px-3 text-lg">{item.cantidad}</span>
                <button
                  onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                  className="px-3 py-1 bg-gray-200 rounded text-lg disabled:opacity-50"
                  disabled={item.cantidad >= item.stock}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => eliminarProducto(item.id)}
                className="mt-3 w-full py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col sm:flex-row justify-end gap-4">
        <p className="text-xl font-bold mb-4 sm:mb-0">
          Total: ${total.toFixed(0)}
        </p>

        <button
          onClick={() => {
            vaciarCarrito();
            setCarrito([]);
          }}
          className="px-5 py-3 bg-gray-300 hover:bg-gray-400 rounded font-semibold"
        >
          Vaciar carrito
        </button>

        <Link
          to="/checkout"
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded text-center"
        >
          Ir al checkout
        </Link>
      </div>
    </section>
  );
}
