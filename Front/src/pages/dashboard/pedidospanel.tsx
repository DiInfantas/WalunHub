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

  const [modalOpen, setModalOpen] = useState(false);
 
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

  const handleAplicarFiltros = () => {
    cargarPedidos();
    setModalOpen(false);
  };

  const handleLimpiarFiltros = () => {
    setFiltros({ id: "", email: "", estado: "", estado_pago: "", tipo_entrega: "" });
    cargarPedidos();
    setModalOpen(false);
  };

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
        <button
          onClick={() => setModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Filtros
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando pedidos...</p>
      ) : (
        Object.entries(pedidosPorEstado).map(([estado, grupo]) => (
          <div key={estado} className="mb-8">
            <h3 className={`text-lg font-bold mb-4 px-2 py-1 rounded ${colorMap[estado] || "bg-gray-100 text-gray-800"}`}>
              Estado: {estado}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {grupo.map((p) => (
                <div key={p.id} className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col">
                  <div className="flex flex-col flex-grow">
                    <h4 className="text-lg font-semibold">{p.nombre}</h4>
                    <p className="text-gray-500 mt-1">ID: {p.id}</p>
                    <p className="text-green-700 font-bold mt-2">${p.total}</p>
                    <p className="mt-1">Pago: {p.metodo_pago}</p>
                    <p className="mt-1">Estado de pago: {p.estado_pago}</p>
                    <p className="mt-1 capitalize">Tipo: {p.tipo_entrega}</p>
                  </div>
                  <Link
                    to={`/admin/pedidos/${p.id}`}
                    className="mt-3 py-2 px-3 bg-green-600 text-white rounded-lg text-center hover:bg-green-700"
                  >
                    Ver detalle
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Modal de filtros */}
      {modalOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setModalOpen(false)}
          />
          <div className="absolute inset-0 flex justify-center items-start pt-20 px-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative z-10">
              <h3 className="text-lg font-bold mb-4">Filtros</h3>

              <div className="space-y-4">
                <input
                  type="number"
                  placeholder="ID"
                  value={filtros.id}
                  onChange={(e) => setFiltros({ ...filtros, id: e.target.value })}
                  className="border px-3 py-2 rounded w-full"
                />
                <input
                  type="text"
                  placeholder="Email"
                  value={filtros.email}
                  onChange={(e) => setFiltros({ ...filtros, email: e.target.value })}
                  className="border px-3 py-2 rounded w-full"
                />
                <select
                  value={filtros.estado}
                  onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                  className="border px-3 py-2 rounded w-full"
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
                  className="border px-3 py-2 rounded w-full"
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
                  className="border px-3 py-2 rounded w-full"
                >
                  <option value="">Todos los tipos</option>
                  <option value="delivery">Delivery</option>
                  <option value="retiro">Retiro en tienda</option>
                </select>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={handleLimpiarFiltros}
                  className="px-4 py-2 rounded-md border w-1/2 mr-2"
                >
                  Limpiar
                </button>
                <button
                  onClick={handleAplicarFiltros}
                  className="px-4 py-2 rounded-md bg-green-600 text-white w-1/2 ml-2 hover:bg-green-700"
                >
                  Aplicar
                </button>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-center" />
    </div>
  );
}
