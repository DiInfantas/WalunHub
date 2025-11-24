import { useEffect, useState } from "react";
import type { ItemCarrito } from "../../interfaces/itemCarrito";
import { obtenerCarrito } from "../carrito/carritoUtils";
import { crearPedido, createPreference } from "../../config/api";
import { Toaster } from "react-hot-toast";
import { toastError } from "../../interfaces/toast";
import { getPerfil } from "../../config/api";


export default function Checkout() {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [pedidoCreado, setPedidoCreado] = useState<any | null>(null);

  const [showEnvioConfirm, setShowEnvioConfirm] = useState(false);
  const [showPagoConfirm, setShowPagoConfirm] = useState(false);
  const [onResult, setOnResult] = useState<() => void>(() => {});

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


  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const perfil = await getPerfil();
        if (!perfil) return;

        setForm((f) => ({
          ...f,
          nombre: f.nombre || perfil.username || "",
          direccion: f.direccion || perfil.direccion || "",
          comuna: f.comuna || perfil.comuna || "",
          telefono: f.telefono || perfil.telefono || "",
          email: f.email || perfil.email || "",
        }));
      } catch (error) {
        console.log("No se pudo cargar perfil:", error);
      }
    };

    cargarPerfil();
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

  // console.log("carrito:", carrito);
  // console.log("pesoTotal calculado:", pesoTotal);
  // console.log("🟢PEDIDO CREADO EN CHECKOUT =>", pedidoCreado);

  const calcularRangoEnvio = (kg: number) => {
    if (kg <= 0) return null;
    if (kg <= 0.5) return { min: 3100, max: 4200 };
    if (kg <= 3) return { min: 4200, max: 4800 };
    if (kg <= 6) return { min: 4800, max: 5400 };
    if (kg <= 20) return { min: 5400, max: 5400 };
    return { min: 9999, max: 15000 };
  };

  const rango = calcularRangoEnvio(pesoTotal);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const EnvioModal = () => {
    if (!showEnvioConfirm || !rango) return null;

    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-xl max-w-sm w-full">
          <h2 className="text-xl font-bold mb-3 text-center">Confirmar envío</h2>
          <p className="mb-4 text-center">
            Tu pedido será <strong>por pagar</strong>.<br />
            Rango estimado:{" "}
            <strong>
              ${rango.min.toLocaleString("es-CL")} -{" "}
              ${rango.max.toLocaleString("es-CL")}
            </strong>
          </p>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => {
                setShowEnvioConfirm(false);
                setShowPagoConfirm(true);
              }}
              className="flex-1 bg-green-600 text-white font-bold py-2 rounded"
            >
              Continuar
            </button>

            <button
              onClick={() => setShowEnvioConfirm(false)}
              className="flex-1 bg-gray-400 text-white font-bold py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ConfirmPagoModal = () => {
    if (!showPagoConfirm) return null;

    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-xl max-w-sm w-full">
          <h2 className="text-xl font-bold mb-4 text-center">
            ¿Seguro que quieres proceder al pago?
          </h2>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => {
                setShowPagoConfirm(false);
                onResult();
              }}
              className="flex-1 bg-green-600 text-white font-bold py-2 rounded"
            >
              Sí, proceder
            </button>

            <button
              onClick={() => setShowPagoConfirm(false)}
              className="flex-1 bg-gray-400 text-white font-bold py-2 rounded"
            >
              No
            </button>
          </div>
        </div>
      </div>
    );
  };


  const ejecutarPago = async () => {
    try {
      const pedido = await crearPedido({
        nombre: form.nombre,
        direccion: form.direccion,
        comuna: form.comuna,
        telefono: form.telefono,
        email: form.email,
        metodo_pago: 1,
        tipo_entrega: form.tipo_entrega,
        total: total,
        items: carrito.map((item) => ({
          producto: item.id,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
        })),
      });

      localStorage.setItem("ultimo_pedido_id", pedido.id);
      setPedidoCreado(pedido);

      const pref = await createPreference(
        pedido.id,
        carrito.map((item) => ({
          title: item.nombre,
          quantity: item.cantidad,
          unit_price: item.precio,
        }))
      );

      console.log("Preferencia generada por MP:", pref);

      if (!pref.init_point) {
        toastError("Error al generar el pago.");
        return;
      }

      window.location.href = pref.init_point;
    } catch (error) {
      console.log("ERROR procesando pago:", error);
      toastError("Error al procesar el pago.");
    }
  };

  const procesarPago = () => {
    if (!carrito.length) return toastError("El carrito está vacío.");

    if (
      !form.nombre ||
      !form.direccion ||
      !form.comuna ||
      !form.telefono ||
      !form.email
    ) {
      return toastError("Completa todos los campos del formulario.");
    }

    if (form.tipo_entrega === "delivery") {
      setShowEnvioConfirm(true);
      setOnResult(() => ejecutarPago);
      return;
    }

    setShowPagoConfirm(true);
    setOnResult(() => ejecutarPago);
  };


  return (
    <>
      <EnvioModal />
      <ConfirmPagoModal />

      <section className="max-w-5xl mx-auto px-6 py-12">
        <Toaster />
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
              className="w-full border-2 border-green-600 p-3 rounded"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">Tipo de entrega</label>
            <select
              name="tipo_entrega"
              value={form.tipo_entrega}
              onChange={handleChange}
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
                <span>
                  ${(item.precio * item.cantidad).toLocaleString("es-CL")}
                </span>
              </li>
            ))}
          </ul>

          <p className="text-right font-bold text-lg mt-4">
            Total: ${total.toLocaleString("es-CL")}
          </p>

          {form.tipo_entrega === "delivery" && (
            <p className="text-right mt-2 font-semibold text-blue-700">
              {rango ? (
                <>
                  Costo de envío estimado: $
                  {rango.min.toLocaleString("es-CL")} - $
                  {rango.max.toLocaleString("es-CL")}
                </>
              ) : (
                <>Costo de envío estimado: {pesoTotal.toFixed(2)} kg — calculando...</>
              )}
            </p>
          )}

          <button
            onClick={procesarPago}
            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded"
          >
            Ir a pagar con MercadoPago
          </button>
        </div>
      </section>
    </>
  );
}



