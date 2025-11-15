import { Link } from "react-router-dom";

export default function Pending() {
  return (
    <section className="max-w-xl mx-auto text-center py-20">
      <h2 className="text-3xl font-bold text-yellow-600">Pago pendiente ⏳</h2>
      <p className="text-gray-700 mt-4">
        Tu pago está siendo procesado. Te notificaremos cuando se confirme.
      </p>

      <Link
        to="/"
        className="mt-8 inline-block bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-6 rounded-lg"
      >
        Volver al inicio
      </Link>
    </section>
  );
}
