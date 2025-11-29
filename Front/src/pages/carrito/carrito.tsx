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
        ? { ...item, cantidad: Math.max(1, cantidad) }
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
      <div className="text-center py-20 px-6">
        <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío 🛒</h2>
        <Link to="/catalogo" className="text-green-600 hover:underline font-semibold">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
        Tu carrito
      </h2>

      <div className="space-y-6">
        {carrito.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-4 border-b pb-5"
          >
            <img
              src={item.imagen || '/img/default.jpg'}
              alt={item.nombre}
              className="w-32 h-32 sm:w-24 sm:h-24 object-cover rounded"
            />

            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-semibold">{item.nombre}</h3>
              <p className="text-sm text-gray-600">${item.precio} /kg</p>

              <div className="flex justify-center sm:justify-start items-center mt-3 gap-2">
                <button
                  onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                  className="px-3 py-1 bg-gray-200 rounded text-lg"
                  disabled={item.cantidad <= 1}
                >
                  −
                </button>

                <span className="px-3 text-lg">{item.cantidad}</span>

                <button
                  onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                  className="px-3 py-1 bg-gray-200 rounded text-lg"
                >
                  +
                </button>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <p className="font-bold text-lg">${item.precio * item.cantidad}</p>
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

      <div className="mt-10">
        <p className="text-xl font-bold text-center sm:text-right mb-4">
          Total: ${total.toFixed(0)}
        </p>

        <div className="flex flex-col sm:flex-row justify-end gap-4">
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
      </div>
    </section>
  );
}
