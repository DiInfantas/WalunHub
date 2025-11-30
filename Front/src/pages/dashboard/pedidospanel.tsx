import { useEffect, useState } from "react";
import { api } from "../../config/api";
import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { toastError } from "../../interfaces/toast";

interface Pedido {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  estado: string;
  estado_pago: string;
  metodo_pago: string;
  tipo_entrega: string;
  total: number;
}

export default function PedidosPanel() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [estadosDisponibles, setEstadosDisponibles] = useState<{ id: number; nombre: string }[]>([]);
  const [estadosPago, setEstadosPago] = useState<{ id: number; nombre: string }[]>([]);

  const [filtros, setFiltros] = useState({
    id: "",
    email: "",
    estado: "",
    estado_pago: "",
    tipo_entrega: "",
  });

  useEffect(() => {
    cargarPedidos();
    cargarEstados();
    cargarEstadosPago();
  }, []);

  const cargarPedidos = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filtros.id) params.append("id", filtros.id);
    if (filtros.email) params.append("email", filtros.email);
    if (filtros.estado) params.append("estado", filtros.estado);
    if (filtros.estado_pago) params.append("estado_pago", filtros.estado_pago);
    if (filtros.tipo_entrega) params.append("tipo_entrega", filtros.tipo_entrega);

    api
      .get(`/pedidos-admin/?${params.toString()}`)
      .then((res) => setPedidos(res.data))
      .catch(() => toastError("Error al cargar pedidos"))
      .finally(() => setLoading(false));
  };

  const cargarEstados = () => {
    api
      .get("/estados-pedido/")
      .then((res) => setEstadosDisponibles(res.data))
      .catch(() => toastError("Error al cargar estados"));
  };

  const cargarEstadosPago = () => {
    api
      .get("/estados-pago/")
      .then((res) => setEstadosPago(res.data))
      .catch(() => toastError("Error al cargar estados de pago"));
  };

  // Agrupar pedidos por estado del pedido
  const pedidosPorEstado: { [estado: string]: Pedido[] } = {};
  pedidos.forEach((p) => {
    const estadoAgrupado = p.estado || "Sin estado";
    if (!pedidosPorEstado[estadoAgrupado]) {
      pedidosPorEstado[estadoAgrupado] = [];
    }
    pedidosPorEstado[estadoAgrupado].push(p);
  });

  const colorMap: Record<string, string> = {
    Pagado: "bg-green-100 text-green-800",
    Pendiente: "bg-yellow-100 text-yellow-800",
    Entregado: "bg-green-100 text-green-800",
    Devuelto: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-green-600">
      <h2 className="text-2xl font-bold text-green-700 mb-6">Gestión de Pedidos</h2>

      <div className="mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Buscar por ID"
          value={filtros.id}
          onChange={(e) => setFiltros({ ...filtros, id: e.target.value })}
          className="border px-3 py-2 rounded w-40"
        />
        <input
          type="text"
          placeholder="Buscar por email"
          value={filtros.email}
          onChange={(e) => setFiltros({ ...filtros, email: e.target.value })}
          className="border px-3 py-2 rounded w-60"
        />
        <select
          value={filtros.estado}
          onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
          className="border px-3 py-2 rounded w-60"
        >
          <option value="">Todos los estados pedido</option>
          {estadosDisponibles.map((estado) => (
            <option key={estado.id} value={estado.nombre}>
              {estado.nombre}
            </option>
          ))}
        </select>
        <select
          value={filtros.estado_pago}
          onChange={(e) => setFiltros({ ...filtros, estado_pago: e.target.value })}
          className="border px-3 py-2 rounded w-60"
        >
          <option value="">Todos los estados de pago</option>
          <option value="Pagado">Pagado</option>
          <option value="Rechazado">Rechazado</option>
          <option value="Devuelto">Devuelto</option>
          <option value="Pago en tienda">Pago en tienda</option>
          <option value="Pendiente">Pendiente</option>
        </select>
        <select
          value={filtros.tipo_entrega}
          onChange={(e) => setFiltros({ ...filtros, tipo_entrega: e.target.value })}
          className="border px-3 py-2 rounded w-60"
        >
          <option value="">Todos los tipos</option>
          <option value="delivery">Delivery</option>
          <option value="retiro">Retiro en tienda</option>
        </select>
        <button
          onClick={cargarPedidos}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Aplicar filtros
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando pedidos...</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(pedidosPorEstado).map(([estado, grupo]) => (
            <div key={estado}>
              <h3
                className={`text-lg font-bold mb-2 px-2 py-1 rounded ${
                  colorMap[estado] || "bg-gray-100 text-gray-800"
                }`}
              >
                Estado: {estado}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {grupo.map((p) => (
                  <div key={p.id} className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">ID: {p.id}</span>
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          colorMap[estado] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {p.estado}
                      </span>
                    </div>
                    <p className="text-sm">
                      <strong>Cliente:</strong> {p.nombre}
                    </p>
                    <p className="text-sm">
                      <strong>Email:</strong> {p.email}
                    </p>
                    <p className="text-sm">
                      <strong>Tel:</strong> {p.telefono}
                    </p>
                    <p className="text-sm">
                      <strong>Total:</strong> ${p.total}
                    </p>
                    <p className="text-sm">
                      <strong>Pago:</strong> {p.metodo_pago} ({p.estado_pago})
                    </p>
                    <p className="text-sm">
                      <strong>Tipo:</strong> {p.tipo_entrega}
                    </p>
                    <Link
                      to={`/admin/pedidos/${p.id}`}
                      className="block mt-2 text-green-600 hover:underline text-sm"
                    >
                      Ver detalle
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Toaster position="top-center" />
    </div>
  );
}
