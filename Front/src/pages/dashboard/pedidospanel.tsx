import { useEffect, useState } from "react";
import { api } from "../../config/api";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

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
  blue_code?: number;
}

export default function PedidosPanel() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [estadosDisponibles, setEstadosDisponibles] = useState<{ id: number; nombre: string }[]>([]);
  const [estadosPago, setEstadosPago] = useState<{ id: number; nombre: string }[]>([]);
  
  const [filtros, setFiltros] = useState({
    email: "",
    nombre: "",
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
    if (filtros.email) params.append("email", filtros.email);
    if (filtros.nombre) params.append("nombre", filtros.nombre);
    if (filtros.estado) params.append("estado", filtros.estado);
    if (filtros.estado_pago) params.append("estado_pago", filtros.estado_pago);
    if (filtros.tipo_entrega) params.append("tipo_entrega", filtros.tipo_entrega);

    api
      .get(`/pedidos-admin/?${params.toString()}`)
      .then((res) => setPedidos(res.data))
      .catch(() => toast.error("Error al cargar pedidos"))
      .finally(() => setLoading(false));
  };

  const cargarEstados = () => {
    api
      .get("/estados-pedido/")
      .then((res) => setEstadosDisponibles(res.data))
      .catch(() => toast.error("Error al cargar estados"));
  };

  const cargarEstadosPago = () => {
    api
      .get("/estados-pago/")
      .then((res) => setEstadosPago(res.data))
      .catch(() => toast.error("Error al cargar estados de pago"));
  };

  const cambiarEstado = async (id: number, nuevoEstado: string) => {
    try {
      await api.patch(`/pedidos/${id}/`, { estado: nuevoEstado });
      toast.success("Estado actualizado");
      cargarPedidos();
    } catch {
      toast.error("Error al actualizar estado");
    }
  };

  const cambiarEstadoPago = async (id: number, nuevoEstado: string) => {
    try {
      await api.patch(`/pedidos/${id}/`, { estado_pago: nuevoEstado });
      toast.success("Estado de pago actualizado");
      cargarPedidos();
    } catch {
      toast.error("Error al actualizar estado de pago");
    }
  };

  const actualizarBlueCode = async (id: number, valor: string) => {
    try {
      await api.patch(`/pedidos/${id}/`, { blue_code: valor });
      toast.success("Código actualizado");
      cargarPedidos();
    } catch {
      toast.error("Error al actualizar código");
    }
  };

  const pedidosPorEstado: { [estado: string]: Pedido[] } = {};
  pedidos.forEach((p) => {
    const estado = p.estado || "Sin estado";
    if (!pedidosPorEstado[estado]) {
      pedidosPorEstado[estado] = [];
    }
    pedidosPorEstado[estado].push(p);
  });

  const colorMap: Record<string, string> = {
    Pagado: "bg-green-100 text-green-800",
    Pendiente: "bg-yellow-100 text-yellow-800",
    Entregado: "bg-blue-100 text-blue-800",
    Devuelto: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-blue-600">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Gestión de Pedidos</h2>

      <div className="mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={filtros.nombre}
          onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
          className="border px-3 py-2 rounded w-60"
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
          <option value="">Todos los estados</option>
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Aplicar filtros
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando pedidos...</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-blue-100 text-blue-700">
              <th className="px-4 py-2 text-left">Cliente</th>
              <th className="px-4 py-2 text-left">Teléfono</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Pago</th>
              <th className="px-4 py-2 text-left">Estado de pago</th>
              <th className="px-4 py-2 text-left">Tipo</th>
              <th className="px-4 py-2 text-left">Blue Code</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          {Object.entries(pedidosPorEstado).map(([estado, grupo]) => {
            const colorClass = colorMap[estado] || "bg-gray-100 text-gray-800";
            return (
              <tbody key={estado}>
                <tr>
                  <td colSpan={8} className={`font-semibold px-4 py-2 ${colorClass}`}>
                    Estado: {estado}
                  </td>
                </tr>
                {grupo.map((p) => (
                  <tr key={p.id} className="border-b">
                    <td className="px-4 py-2">{p.nombre}</td>
                    <td className="px-4 py-2">{p.telefono}</td>
                    <td className="px-4 py-2">${p.total}</td>
                    <td className="px-4 py-2">{p.metodo_pago}</td>
                    <td className="px-4 py-2">
                      <select
                        value={p.estado_pago}
                        onChange={(e) => cambiarEstadoPago(p.id, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1"
                      >
                        {estadosPago.map((estado) => (
                          <option key={estado.id} value={estado.nombre}>
                            {estado.nombre}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2 capitalize">{p.tipo_entrega}</td>
                    <td className="px-4 py-2">
                      {p.tipo_entrega === "delivery" ? (
                        <input
                          type="text"
                          value={p.blue_code || ""}
                          onChange={(e) => actualizarBlueCode(p.id, e.target.value)}
                          className="border px-2 py-1 rounded w-full"
                        />
                      ) : (
                        <input
                          type="text"
                          value="No aplica"
                          disabled
                          className="border px-2 py-1 rounded w-full bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                      )}
                    </td>
                    <td className="px-4 py-2 space-y-2">
                      <select
                        value={p.estado}
                        onChange={(e) => cambiarEstado(p.id, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      >
                        {estadosDisponibles.map((estado) => (
                          <option key={estado.id} value={estado.nombre}>
                            {estado.nombre}
                          </option>
                        ))}
                      </select>
                      <Link
                        to={`/admin/pedidos/${p.id}`}
                        className="block text-blue-600 hover:underline text-sm mt-1"
                      >
                        Ver detalle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            );
          })}
        </table>
      )}

      <Toaster position="top-center" />
    </div>
  );
}