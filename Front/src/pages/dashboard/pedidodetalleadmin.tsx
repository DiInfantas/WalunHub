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
  items: {
    id: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
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

  useEffect(() => {
    cargarPedido();
    cargarEstados();
  }, [id]);

  const cargarPedido = async () => {
    try {
      const res = await api.get(`/pedidos/${id}/`);
      setPedido(res.data);
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

  if (loading) {
    return <p className="p-6 text-center text-lg">Cargando pedido...</p>;
  }

  if (!pedido) {
    return <p className="p-6 text-center text-red-500">Pedido no encontrado.</p>;
  }

  return (
    <section className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Gestión de Pedido #{pedido.id}</h1>

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
              <input
                type="text"
                value={pedido.blue_code || ""}
                onChange={(e) => actualizarCampo("blue_code", e.target.value)}
                className="border px-3 py-2 rounded w-full"
              />
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

      <div className="bg-white shadow rounded-lg p-5">
        <h2 className="text-2xl font-semibold mb-4">Productos del pedido</h2>

        <div className="space-y-4">
          {pedido.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b pb-4">
              <img
                src={item.producto.imagenes?.[0]?.imagen || "/no-image.png"}
                alt={item.producto.nombre}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <p className="text-lg font-semibold">{item.producto.nombre}</p>
                <p className="text-gray-600">
                  {item.cantidad} × ${item.precio_unitario}
                </p>
              </div>
              <p className="text-lg font-bold">${item.subtotal}</p>
            </div>
          ))}
        </div>

        <div className="text-right mt-6 text-xl font-bold">
          Total: ${pedido.total}
        </div>
      </div>

      <Toaster position="top-center" />
    </section>
  );
}