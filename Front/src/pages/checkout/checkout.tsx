import { useEffect, useState } from 'react';
import type { ItemCarrito } from "../../interfaces/itemCarrito";
import { obtenerCarrito, vaciarCarrito } from '../carrito/carritoUtils';

export default function Checkout() {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    comuna: '',
    telefono: '',
    email: '',
  });

  useEffect(() => {
    setCarrito(obtenerCarrito());
  }, []);

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Pedido confirmado:', { ...form, carrito });
    vaciarCarrito();
    alert('¡Gracias por tu compra!');
  };

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">Confirmar pedido</h2>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6 mb-10">
        <div>
          <label className="block font-semibold mb-1">Nombre completo</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="w-full border-2 border-green-600 p-3 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Teléfono</label>
          <input
            type="tel"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            required
            className="w-full border-2 border-green-600 p-3 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Dirección</label>
          <input
            type="text"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            required
            className="w-full border-2 border-green-600 p-3 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Comuna / Región</label>
          <input
            type="text"
            name="comuna"
            value={form.comuna}
            onChange={handleChange}
            required
            className="w-full border-2 border-green-600 p-3 rounded"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block font-semibold mb-1">Correo electrónico</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border-2 border-green-600 p-3 rounded"
          />
        </div>
      </form>

      <div className="bg-white shadow rounded p-6">
        <h3 className="text-xl font-bold mb-4">Resumen del pedido</h3>
        <ul className="divide-y">
          {carrito.map((item) => (
            <li key={item.id} className="py-2 flex justify-between">
              <span>
                {item.nombre} x {item.cantidad}
              </span>
              <span>${item.precio * item.cantidad}</span>
            </li>
          ))}
        </ul>
        <p className="text-right font-bold text-lg mt-4">Total: ${total.toFixed(0)}</p>
        <button
          type="submit"
          onClick={handleSubmit}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded"
        >
          Confirmar pedido
        </button>
      </div>
    </section>
  );
}