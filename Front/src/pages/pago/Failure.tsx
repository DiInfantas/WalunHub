import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export default function Failure() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const status = params.get("status");

    // Bloquear acceso directo
    if (status !== "failure") {
      navigate("/");
    }
  }, []);

  return (
    <section className="max-w-xl mx-auto text-center py-20">
      <h2 className="text-3xl font-bold text-red-600">Pago fallido ❌</h2>
      <p className="text-gray-700 mt-4">
        Ocurrió un problema al procesar tu pago. Por favor intenta nuevamente.
      </p>

      <Link
        to="/checkout"
        className="mt-8 inline-block bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg"
      >
        Volver al checkout
      </Link>
    </section>
  );
}
