import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/api";
import fotohero from "../../assets/img/Hero.png";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  destacado: boolean;
  imagenes: { imagen: string }[];
}

export default function Home() {
  const [destacados, setDestacados] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/productos/`)
      .then((res) => res.json())
      .then((data: Producto[]) => {
        const filtrados = data.filter((p) => p.destacado);
        setDestacados(filtrados);
      })
      .catch((err) =>
        console.error("Error al cargar productos destacados:", err)
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="bg-gradient-to-b from-green-50 to-white min-h-screen font-sans text-gray-800">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-700 to-green-600 text-white">
        <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center justify-between px-6 py-20">
          {/* Texto */}
          <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Frutos secos frescos y naturales 🌱
            </h1>
            <p className="text-lg opacity-90">
              Calidad premium, directamente del campo a tu mesa. Vive el sabor
              auténtico de lo natural.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="/catalogo"
                className="px-6 py-3 rounded-lg bg-white text-green-700 font-semibold shadow hover:bg-green-100 transition"
              >
                Ver catálogo
              </a>
              <a
                href="/nosotros"
                className="px-6 py-3 rounded-lg border border-white font-semibold text-white hover:bg-green-700 transition"
              >
                Conócenos
              </a>
            </div>
          </div>

          {/* Imagen */}
          <div className="lg:w-1/2 mb-10 lg:mb-0 flex justify-center">
            <img
              src={fotohero}
              alt="Frutos secos"
              className="w-3/4 max-w-md drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Efecto decorativo */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-green-50 to-transparent" />
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="px-6 md:px-12 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-10">
          Productos destacados
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Cargando productos...</p>
        ) : destacados.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {destacados.map((producto) => (
              <div
                key={producto.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-green-100"
              >
                <div className="overflow-hidden">
                  <img
                    src={producto.imagenes?.[0]?.imagen || "/img/default.jpg"}
                    alt={producto.nombre}
                    className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {producto.nombre}
                  </h3>
                  <p className="text-emerald-700 font-bold mt-2">
                    $
                    {producto.precio
                      ? producto.precio.toLocaleString("es-CL")
                      : "—"}
                  </p>
                  <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">
                    Agregar al carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No hay productos destacados disponibles.
          </p>
        )}
      </section>

      {/* CTA Final */}
      <section className="bg-green-100 py-12 text-center">
        <h3 className="text-2xl font-semibold text-green-800 mb-4">
          ¿Listo para probar lo mejor de la naturaleza?
        </h3>
        <a
          href="/catalogo"
          className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg shadow hover:bg-green-700 transition"
        >
          Explorar catálogo
        </a>
      </section>
      {/* FOOTER */}
    </main>
  );
}
