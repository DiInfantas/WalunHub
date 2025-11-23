import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../config/api";
import toast from "react-hot-toast";
import { redirectWithToast } from '../../interfaces/navigationWithToast';

export default function PedidoDetalleCliente() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pedido, setPedido] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarPedido() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Debes iniciar sesión para ver tus pedidos");
          navigate("/login");
          return;
        }

        const res = await api.get(`/pedidos/${id}/`);
        setPedido(res.data);

      } catch (error: any) {
        if (error.response?.status === 403) {
          redirectWithToast(navigate, "No tienes permiso para ver este pedido", "/perfil");
          return;
        }

        toast.error("No se pudo cargar el pedido");
      } finally {
        setLoading(false);
      }
    }

    cargarPedido();
  }, [id, navigate]);

  if (loading) {
    return <p className="p-6 text-center text-lg">Cargando pedido...</p>;
  }

  if (!pedido) {
    return <p className="p-6 text-center text-red-500">Pedido no encontrado.</p>;
  }

  return (
    <section className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate("/perfil")}
        className="mb-6 text-green-700 hover:underline"
      >
        ← Volver al perfil
      </button>

      <h1 className="text-3xl font-bold mb-6 text-green-700">
        Pedido #{pedido.id}
      </h1>

      <div className="bg-white shadow-md rounded-lg p-5 mb-6">
        <h2 className="text-xl font-semibold mb-3">Datos del cliente</h2>
        <p><strong>Nombre:</strong> {pedido.nombre}</p>
        <p><strong>Dirección:</strong> {pedido.direccion}</p>
        <p><strong>Comuna:</strong> {pedido.comuna}</p>
        <p><strong>Email:</strong> {pedido.email}</p>
        <p><strong>Teléfono:</strong> {pedido.telefono}</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-5 mb-6">
        <h2 className="text-xl font-semibold mb-3">Estado del pedido</h2>

        <p><strong>Tipo de entrega:</strong> {pedido.tipo_entrega}</p>
        <p><strong>Estado:</strong> {pedido.estado}</p>
        <p><strong>Estado de pago:</strong> {pedido.estado_pago || "—"}</p>
        <p><strong>Método de pago:</strong> {pedido.metodo_pago}</p>
        <p><strong>Payment ID:</strong> {pedido.payment_id || "—"}</p>
        <p><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleString()}</p>

        <p className="mt-2">
          <strong>Código BlueExpress:</strong> [Pendiente] (Esté atento a su correo dentro de 24–48 hrs hábiles)
        </p>

        {pedido.tipo_entrega === "delivery" && (
          <div className="mt-4">
            <p>
              <strong>Costo envío:</strong>{" "}
              ${pedido.costo_envio_min} – ${pedido.costo_envio_max}
            </p>
            <p className="text-gray-600">
              Pendiente por pagar en su domicilio.
            </p>
          </div>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-5">
        <h2 className="text-2xl font-semibold mb-4">Productos del pedido</h2>

        <div className="space-y-4">
          {pedido.items.map((item: any) => (
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
    </section>
  );
}


