import { useEffect, useState } from "react";
import type { ItemCarrito } from "../../interfaces/itemCarrito";
import { obtenerCarrito } from "../carrito/carritoUtils";
import { crearPedido, createPreference } from "../../config/api";

export default function Checkout() {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    comuna: "",
    telefono: "",
    email: "",
    tipo_entrega: "delivery",
  });

  useEffect(() => {
    setCarrito(obtenerCarrito());
  }, []);

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const pesoTotal = carrito.reduce((acc, item) => {
    const raw = item.peso_kg ?? 0;
    const pesoNum =
      typeof raw === "string"
        ? parseFloat(raw.replace(",", "."))
        : Number(raw);
    const peso = isNaN(pesoNum) ? 0 : pesoNum;
    return acc + peso * item.cantidad;
  }, 0);

  console.log("carrito:", carrito);
  console.log("pesoTotal calculado:", pesoTotal);


  const calcularEnvio = (peso: number) => {
    if (peso <= 0.5) return 3100;
    if (peso <= 3) return 4200;
    if (peso <= 6) return 4800;
    return 5400;
  };

  const costoEnvio =
    form.tipo_entrega === "delivery" ? calcularEnvio(pesoTotal) : 0;

  const totalFinal = total + costoEnvio;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const procesarPago = async () => {
    if (!carrito.length) {
      alert("El carrito está vacío.");
      return;
    }

    if (
      !form.nombre ||
      !form.direccion ||
      !form.comuna ||
      !form.telefono ||
      !form.email
    ) {
      alert("Completa todos los campos.");
      return;
    }

    try {
      const pedido = await crearPedido({
        nombre: form.nombre,
        direccion: form.direccion,
        comuna: form.comuna,
        telefono: form.telefono,
        email: form.email,
        estado: 1,
        metodo_pago: 1,
        tipo_entrega: form.tipo_entrega,
        total: total, // <-- SOLO total de productos
        items: carrito.map((item) => ({
          producto: item.id,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
        })),
      });

      localStorage.setItem("ultimo_pedido_id", pedido.id);

      console.log("PEDIDO CREADO =>", pedido);

      const pref = await createPreference(
        pedido.id,
        carrito.map((item) => ({
          title: item.nombre,
          quantity: item.cantidad,
          unit_price: item.precio,
        }))
      );

      console.log("PREFERENCE =>", pref);

      if (!pref.init_point) {
        alert("Error al generar el pago.");
        return;
      }

      window.location.href = pref.init_point;
    } catch (error) {
      alert("Error al procesar el pago.");
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
        Confirmar pedido
      </h2>

      
      <form className="grid md:grid-cols-2 gap-6 mb-10">
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

        <div className="md:col-span-2">
          <label className="block font-semibold mb-1">Tipo de entrega</label>
          <select
            name="tipo_entrega"
            value={form.tipo_entrega}
            onChange={(e) => setForm({ ...form, tipo_entrega: e.target.value })}
            className="w-full border-2 border-green-600 p-3 rounded"
          >
            <option value="delivery">Delivery</option>
            <option value="retiro">Retiro en tienda</option>
          </select>
        </div>
      </form>

      
      <div className="bg-white shadow rounded p-6">
        <h3 className="text-xl font-bold mb-4">Resumen del pedido</h3>
        <ul className="divide-y">
          {carrito.map((item) => (
            <li
              key={item.id}
              className="py-2 flex justify-between items-center gap-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.imagen || "/img/default.jpg"}
                  alt={item.nombre}
                  className="w-12 h-12 rounded object-cover"
                />
                <span>
                  {item.nombre} x {item.cantidad}
                </span>
              </div>
              <span>${item.precio * item.cantidad}</span>
            </li>
          ))}
        </ul>

        <p className="text-right font-bold text-lg mt-4">
          Total: ${total.toLocaleString("es-CL")}
        </p>

        {form.tipo_entrega === "delivery" && (
          <p className="text-right mt-2">
            Costo de envío estimado: ${costoEnvio.toLocaleString("es-CL")}
          </p>
        )}

        <p className="text-right font-bold text-lg mt-4">
          Total final: ${totalFinal.toLocaleString("es-CL")}
        </p>

        <button
          onClick={procesarPago}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded"
        >
          Ir a pagar con MercadoPago
        </button>
      </div>
    </section>
  );
}
