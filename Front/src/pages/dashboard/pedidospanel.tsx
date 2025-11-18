import { useEffect, useState } from "react";
import { api } from "../../config/api";
import toast from "react-hot-toast";

interface Pedido {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  estado: string;
  metodo_pago: string;
  total: number;
}

export default function PedidosPanel() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/pedidos/")
      .then((res) => setPedidos(res.data))
      .catch(() => toast.error("Error al cargar pedidos"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-blue-600">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Gestión de Pedidos</h2>
      {loading ? (
        <p className="text-gray-600">Cargando pedidos...</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-blue-100 text-blue-700">
              <th className="px-4 py-2 text-left">Cliente</th>
              <th className="px-4 py-2 text-left">Teléfono</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Pago</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="px-4 py-2">{p.nombre}</td>
                <td className="px-4 py-2">{p.telefono}</td>
                <td className="px-4 py-2">${p.total}</td>
                <td className="px-4 py-2">{p.estado}</td>
                <td className="px-4 py-2">{p.metodo_pago}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}