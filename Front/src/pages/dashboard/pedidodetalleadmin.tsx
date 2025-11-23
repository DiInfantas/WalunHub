import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../config/api";
import toast, { Toaster } from "react-hot-toast";

interface Pedido {
  id: number;
  nombre: string;
  direccion: string;
  comuna: string;
  telefono: string;
  email: string;
  estado: string;
  estado_pago: string;
  metodo_pago: string;
  payment_id: string;
  fecha: string;
  total: number;
  blue_code?: string;
  tipo_entrega: string;
  costo_envio_min: number;
  costo_envio_max: number;
  items: {
    id: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    peso_unitario: number;
    peso_total_item: number;
    producto: {
      nombre: string;
      imagenes: { imagen: string }[];
    };
  }[];
}

export default function PedidoDetalleAdmin() {
  const { id } = useParams();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [estadosPedido, setEstadosPedido] = useState<{ id: number; nombre: string }[]>([]);
  const [estadosPago, setEstadosPago] = useState<{ id: number; nombre: string }[]>([]);
  const [blueCodeTemp, setBlueCodeTemp] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarPedido();
    cargarEstados();
  }, [id]);

  const cargarPedido = async () => {
    try {
      const res = await api.get(`/pedidos/${id}/`);
      setPedido(res.data);

      setBlueCodeTemp(res.data.blue_code || "");
    } catch {
      toast.error("Error al cargar el pedido");
    } finally {
      setLoading(false);
    }
  };

  const cargarEstados = async () => {
    try {
      const [resPedido, resPago] = await Promise.all([
        api.get("/estados-pedido/"),
        api.get("/estados-pago/"),
      ]);
      setEstadosPedido(resPedido.data);
      setEstadosPago(resPago.data);
    } catch {
      toast.error("Error al cargar estados");
    }
  };

  const actualizarCampo = async (campo: "estado" | "estado_pago" | "blue_code", valor: string) => {
    if (!pedido) return;
    try {
      await api.patch(`/pedidos/${pedido.id}/`, { [campo]: valor });
      toast.success(`Campo actualizado: ${campo}`);
      cargarPedido();
    } catch {
      toast.error(`Error al actualizar ${campo}`);
    }
  };


  const guardarBlueCode = async () => {
    if (!pedido) return;

    try {
      await api.patch(`/pedidos/${pedido.id}/`, { blue_code: blueCodeTemp });
      toast.success("Blue Code actualizado");
      cargarPedido();
    } catch {
      toast.error("Error al actualizar Blue Code");
    }

    setMostrarModal(false);
  };

  if (loading) {
    return <p className="p-6 text-center text-lg">Cargando pedido...</p>;
  }

  if (!pedido) {
    return <p className="p-6 text-center text-red-500">Pedido no encontrado.</p>;
  }

  return (
    <section className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-green-800">
        Gestión de Pedido #{pedido.id}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-xl font-semibold mb-3">Datos del cliente</h2>
          <p><strong>Nombre:</strong> {pedido.nombre}</p>
          <p><strong>Dirección:</strong> {pedido.direccion}</p>
          <p><strong>Comuna:</strong> {pedido.comuna}</p>
          <p><strong>Email:</strong> {pedido.email}</p>
          <p><strong>Teléfono:</strong> {pedido.telefono}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-xl font-semibold mb-3">Estado y pago</h2>

          <div className="mb-3">
            <label className="block font-medium mb-1">Tipo de entrega</label>
            <input
              type="text"
              value={pedido.tipo_entrega}
              disabled
              className="border px-3 py-2 rounded w-full bg-gray-100"
            />
          </div>

          <div className="mb-3">
            <label className="block font-medium mb-1">Estado del pedido</label>
            <select
              value={pedido.estado || ""}
              onChange={(e) => actualizarCampo("estado", e.target.value)}
              className="border px-3 py-2 rounded w-full"
            >
              {estadosPedido.map((estado) => (
                <option key={estado.id} value={estado.nombre}>
                  {estado.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="block font-medium mb-1">Estado de pago</label>
            <select
              value={pedido.estado_pago || ""}
              onChange={(e) => actualizarCampo("estado_pago", e.target.value)}
              className="border px-3 py-2 rounded w-full"
            >
              {estadosPago.map((estado) => (
                <option key={estado.id} value={estado.nombre}>
                  {estado.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="block font-medium mb-1">Blue Code</label>

            {pedido.tipo_entrega === "delivery" ? (
              <>
                <input
                  type="text"
                  value={blueCodeTemp}
                  onChange={(e) => setBlueCodeTemp(e.target.value)}
                  className="border px-3 py-2 rounded w-full"
                />

                <button
                  onClick={() => setMostrarModal(true)}
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Guardar Blue Code
                </button>
              </>
            ) : (
              <input
                type="text"
                value="No aplica"
                disabled
                className="border px-3 py-2 rounded w-full bg-gray-100 text-gray-500"
              />
            )}
          </div>

          <p><strong>Método de pago:</strong> {pedido.metodo_pago}</p>
          <p><strong>Payment ID:</strong> {pedido.payment_id || "—"}</p>
          <p><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleString()}</p>
        </div>
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-3">Confirmar Código BlueExpress</h2>
            <p className="mb-4">
              ¿Estás seguro de ingresar este código de BlueExpress?
              <br />
              Al confirmar, se enviará un correo al cliente.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setMostrarModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>

              <button
                onClick={guardarBlueCode}
                className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-5">
        <h2 className="text-2xl font-semibold mb-4">Productos del pedido</h2>

        <div className="space-y-4">
          {pedido.items.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row gap-4 border-b pb-4">
              <img
                src={item.producto.imagenes?.[0]?.imagen || "/no-image.png"}
                alt={item.producto.nombre}
                className="w-20 h-20 object-cover rounded"
              />

              <div className="flex-1">
                <p className="text-lg font-semibold">{item.producto.nombre}</p>

                <p><strong>Cantidad:</strong> {item.cantidad}</p>
                <p><strong>Precio unitario:</strong> ${item.precio_unitario}</p>
                <p><strong>Peso unitario:</strong> {item.peso_unitario} kg</p>
                <p><strong>Peso total del ítem:</strong> {item.peso_total_item} kg</p>
              </div>

              <p className="text-lg font-bold">${item.subtotal}</p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <p><strong>Costo envío mínimo:</strong> ${pedido.costo_envio_min}</p>
          <p><strong>Costo envío máximo:</strong> ${pedido.costo_envio_max}</p>
        </div>

        <div className="text-right mt-6 text-xl font-bold">
          Total: ${pedido.total}
        </div>
      </div>

      <Toaster position="top-center" />
    </section>
  );
}
