import { Link } from "react-router-dom";

export default function Success() {
  return (
    <section className="max-w-xl mx-auto text-center py-20">
      <h2 className="text-3xl font-bold text-green-700">¡Pago exitoso! 🎉</h2>
      <p className="text-gray-700 mt-4">
        Gracias por tu compra. Tu pago fue procesado correctamente.
      </p>

      <Link
        to="/"
        className="mt-8 inline-block bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg"
      >
        Volver al inicio
      </Link>
    </section>
  );
}