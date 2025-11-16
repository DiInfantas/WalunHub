import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { updatePedidoPago } from "../../config/api";
import { getPedido } from "../../config/api";


export default function Success() {
  const [params] = useSearchParams();
  const [ticketUrl, setTicketUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pedidoId, setPedidoId] = useState<string | null>(null);

  useEffect(() => {
    async function confirmarPago() {
      setLoading(true);
      setError(null);

      const paymentId = params.get("payment_id");
      const status = params.get("status"); 
      let pedidoLocal = localStorage.getItem("ultimo_pedido_id");

      if (!paymentId || !status) {
        setError("Datos de pago incompletos en la URL.");
        setLoading(false);
        return;
      }

      if (!pedidoLocal) {
        setError(
          "No se encontró el ID del pedido localmente. Guarda este payment_id: " +
            paymentId
        );
        setLoading(false);
        return;
      }

      try {
        setPedidoId(pedidoLocal);

        await updatePedidoPago(Number(pedidoLocal), status, paymentId);

        const pedidoData = await getPedido(Number(pedidoLocal));
        setTicketUrl(pedidoData.ticket_url || null);

        // limpiar local
        localStorage.removeItem("carrito");
        // localStorage.removeItem("ultimo_pedido_id");

        setLoading(false);
      } catch (err) {
        console.error("Error actualizando pedido:", err);
        setError("Ocurrió un error al confirmar el pago.");
        setLoading(false);
      }
    }

    confirmarPago();
  }, [params, navigate]);

  if (loading) {
    return (
      <section className="p-10 text-center">
        <h1 className="text-2xl font-semibold">Confirmando pago...</h1>
      </section>
    );
  }

  if (error) {
    return (
      <section className="p-10 text-center">
        <h1 className="text-2xl font-semibold text-red-600">Problema</h1>
        <p className="mt-4">{error}</p>
      </section>
    );
  }

  const status = params.get("status");

  return (
    <section className="p-10 text-center">
      {status === "approved" ? (
        <>
          <h1 className="text-3xl font-bold text-green-600">
            ¡Pago exitoso!
          </h1>
          <p className="mt-4">Tu pedido fue confirmado.</p>

          {pedidoId && (
            <button
              onClick={() => navigate(`/pedido/${pedidoId}`)}
              className="mt-6 px-6 py-3 bg-green-600 text-white rounded-md"
            >
              Ver mi pedido
            </button>
          )}
          {ticketUrl && (
            <a
              href={ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 ml-3 px-6 py-3 bg-blue-600 text-white rounded-md inline-block"
            >
              Descargar boleta
            </a>
          )}
        </>
      ) : status === "pending" ? (
        <>
          <h1 className="text-3xl font-bold text-yellow-600">
            Pago pendiente
          </h1>
          <p className="mt-4">
            Cuando se confirme, te avisaremos por correo.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-red-600">
            Pago rechazado
          </h1>
          <p className="mt-4">Intenta nuevamente.</p>
        </>
      )}
    </section>
  );
}