// src/pages/404.tsx
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-6">
      <h1 className="text-6xl font-bold text-green-700 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Página no encontrada
      </h2>
      <p className="text-gray-600 mb-6">
        Lo sentimos, la ruta que estás buscando no existe o fue movida.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200"
      >
        Volver al inicio
      </Link>
    </div>
  );
}