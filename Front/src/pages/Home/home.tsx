import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/api";
import type { Producto } from "../../interfaces/producto";
import HeroImg from "../../assets/img/heroimg.jpg";

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

export default function Home(): JSX.Element {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productosDestacados, setProductosDestacados] = useState<Producto[]>([]);
  const [ultimosProductos, setUltimosProductos] = useState<Producto[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/categorias/`)
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch(() => console.error("Error cargando categorías"));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/productos/`)
      .then((res) => res.json())
      .then((data) => {
        setProductosDestacados(data.filter((p: Producto) => p.destacado));
        setUltimosProductos(data.slice(-8));
      })
      .catch(() => console.error("Error cargando productos"));
  }, []);

  return (
    <div className="flex flex-col gap-16">

      <section className="relative h-[70vh] flex items-center justify-center text-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HeroImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20" />
        <div className="relative z-10 text-white px-6 max-w-3xl">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
            Alimentación Natural, Simple y Consciente
          </h1>
          <p className="text-lg mb-6 text-gray-100 drop-shadow">
            Descubre productos a granel seleccionados para cuidar de tu bienestar,
            tu bolsillo y el planeta.
          </p>
          <a
            href="/catalogo"
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            Ver Catálogo
          </a>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Conoce WalunGranel
          </h3>

          <p className="text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            <strong>WalunGranel</strong> nace con el propósito de hacer accesible un consumo más consciente,
            natural y sustentable. Nuestro nombre proviene de la palabra mapuche
            <strong> “Walüng” </strong>, que significa <em>“abundancia, cosecha y bienestar”</em>.
            <br /><br />
            Desde ese significado construimos nuestra esencia: alimentos reales, de calidad,
            a granel y sin exceso de envases.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            <div className="group bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl mb-3">🌱</div>
              <h4 className="text-xl font-semibold text-green-900 mb-2">Comer Natural</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                Productos sin procesar, sin aditivos y en su estado más puro.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl mb-3">♻️</div>
              <h4 className="text-xl font-semibold text-green-900 mb-2">Consumo Responsable</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                Promovemos compras conscientes y reducción de envases.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl mb-3">🌾</div>
              <h4 className="text-xl font-semibold text-green-900 mb-2">Calidad y Variedad</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                Frutos secos, semillas, legumbres y granos para tu día a día.
              </p>
            </div>

          </div>
        </div>
      </section>
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800">
            Categorías Destacadas
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-10">
            Encuentra tus productos favoritos organizados por categoría.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categorias.slice(0, 6).map((cat) => (
              <a
                key={cat.id}
                href={`/catalogo?categoria=${encodeURIComponent(cat.nombre)}`}
                className="group bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-2xl font-semibold text-green-900">
                    {cat.nombre}
                  </h4>
                  <span className="text-green-700 opacity-0 group-hover:opacity-100 transition-all text-2xl">
                    →
                  </span>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed">
                  {cat.descripcion || "Explora los productos de esta categoría."}
                </p>
              </a>
            ))}
          </div>

          <div className="mt-10">
            <a
              href="/catalogo"
              className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition"
            >
              Ver todas las categorías
            </a>
          </div>
        </div>
      </section>


      <section className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-6">Productos Destacados</h2>

        {/* Ahora: 2 columnas en celular, 3 en tablets, 4 en desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productosDestacados.map((p) => {
            const imagen = p.imagenes?.[0]?.imagen || "/img/default.jpg";

            return (
              <a
                key={p.id}
                href={`/producto/${p.id}`}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col"
              >
                <img
                  src={imagen}
                  alt={p.nombre}
                  className="w-full h-48 object-cover rounded-lg"
                />

                <h3 className="text-lg font-semibold mt-3 line-clamp-1">
                  {p.nombre}
                </h3>

                <p className="text-xl font-bold text-green-700 mt-2">
                  ${p.precio.toLocaleString("es-CL")}
                </p>

                <p className="text-sm text-gray-500">
                  Bolsa de {Number(p.peso_kg)} kg
                </p>
              </a>
            );
          })}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-6">Últimos Productos</h2>

        {/* Ahora también 2 por fila en celular */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ultimosProductos.map((p) => {
            const imagen = p.imagenes?.[0]?.imagen || "/img/default.jpg";

            return (
              <a
                key={p.id}
                href={`/producto/${p.id}`}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col"
              >
                <img
                  src={imagen}
                  alt={p.nombre}
                  className="w-full h-48 object-cover rounded-lg"
                />

                <h3 className="text-lg font-semibold mt-3 line-clamp-1">
                  {p.nombre}
                </h3>

                <p className="text-xl font-bold text-green-700 mt-2">
                  ${p.precio.toLocaleString("es-CL")}
                </p>

                <p className="text-sm text-gray-500">
                  Bolsa de {Number(p.peso_kg)} kg
                </p>
              </a>
            );
          })}
        </div>
      </section>



      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Lo que dicen nuestros clientes
          </h3>

          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            La calidad y frescura de nuestros productos hablan por sí solas.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left">
              <p className="text-gray-700 italic mb-4">
                “Los frutos secos son fresquísimos. Nada que ver con lo del súper.”
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center text-xl">😊</div>
                <div>
                  <h4 className="font-semibold text-green-900">María P.</h4>
                  <p className="text-sm text-gray-600">Compradora frecuente</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left">
              <p className="text-gray-700 italic mb-4">
                “Me encanta comprar solo lo necesario. Envío rápido y todo impecable.”
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center text-xl">🌿</div>
                <div>
                  <h4 className="font-semibold text-green-900">Diego A.</h4>
                  <p className="text-sm text-gray-600">Cliente desde 2023</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left">
              <p className="text-gray-700 italic mb-4">
                “Los superalimentos de aquí son de excelente calidad.”
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center text-xl">⭐</div>
                <div>
                  <h4 className="font-semibold text-green-900">Constanza R.</h4>
                  <p className="text-sm text-gray-600">Fan de los superalimentos</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      <section className="text-center py-14 bg-green-50">
        <h2 className="text-3xl font-bold mb-3 text-gray-800">
          Vive mejor, come mejor.
        </h2>
        <p className="text-gray-600 mb-6">
          Únete al movimiento de alimentación consciente con productos naturales y a granel.
        </p>
        <a
          href="/catalogo"
          className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
        >
          Empezar ahora
        </a>
      </section>
    </div>
  );
}
