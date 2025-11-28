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
        setUltimosProductos(data.slice(-6));
      })
      .catch(() => console.error("Error cargando productos"));
  }, []);

  return (
    <div className="flex flex-col gap-24">

      {/* HERO con imagen de fondo */}
      <section
        className="relative h-[70vh] flex items-center justify-center text-center"
      >
        {/* Imagen de fondo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${HeroImg})`, // <-- aquí pones tu imagen
          }}
        />

        {/* Capa de degradado */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20" />

        {/* Contenido */}
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

      {/* ---------------------------------- */}
      {/*  SECCIÓN: SOBRE WALUNGRANEL        */}
      {/* ---------------------------------- */}

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Conoce WalunGranel
          </h3>

          <p className="text-gray-600 max-w-2xl mx-auto mb-16 leading-relaxed">
            <strong>WalunGranel</strong> nace con el propósito de hacer accesible un consumo más consciente,
            natural y sustentable. Nuestro nombre proviene de la palabra mapuche
            <strong>“Walüng”</strong>, que significa <em>“abundancia, cosecha y bienestar”</em>,
            reflejando la conexión con la tierra y el valor de los alimentos naturales.
            <br /><br />
            Desde este significado construimos nuestra esencia: alimentos reales, de calidad,
            a granel y sin exceso de envases.
          </p>

          {/* Grid de valores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Card 1 */}
            <div className="group bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 
        rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 
        transition-all duration-300">
              <div className="text-4xl mb-3">🌱</div>
              <h4 className="text-xl font-semibold text-green-900 mb-2">Comer Natural</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                Productos seleccionados sin procesar, sin aditivos y en su estado más puro—
                tal como deberían ser.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 
        rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 
        transition-all duration-300">
              <div className="text-4xl mb-3">♻️</div>
              <h4 className="text-xl font-semibold text-green-900 mb-2">Consumo Responsable</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                Promovemos un estilo de compra consciente, reduciendo envases y eligiendo
                solo lo que realmente necesitas.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 
        rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 
        transition-all duration-300">
              <div className="text-4xl mb-3">🌾</div>
              <h4 className="text-xl font-semibold text-green-900 mb-2">Calidad y Variedad</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                Una selección amplia de frutos secos, semillas, legumbres y granos
                para acompañar cualquier estilo de vida.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="text-xl font-semibold mb-2">Productos Naturales</h3>
          <p className="text-gray-600">Seleccionamos ingredientes puros y de calidad para una vida más saludable.</p>
        </div>
        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="text-xl font-semibold mb-2">A Granel</h3>
          <p className="text-gray-600">Compra solo lo que necesitas y reduce el desperdicio.</p>
        </div>
        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="text-xl font-semibold mb-2">Precios Justos</h3>
          <p className="text-gray-600">Accesible y transparente para que tu alimentación sea sostenible.</p>
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-6">Productos Destacados</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {productosDestacados.map((p) => (
            <a
              key={p.id}
              href={`/producto/${p.id}`}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4"
            >
              <img
                src={p.imagenes[0]?.imagen || "/img/default.jpg"}
                alt={p.nombre}
                className="w-full h-48 object-cover rounded-lg"
              />
              <h3 className="text-lg font-semibold mt-3">{p.nombre}</h3>
              <p className="text-green-700 font-bold">${p.precio} / kg</p>
            </a>
          ))}
        </div>
      </section>

      {/* ÚLTIMOS PRODUCTOS */}
      <section className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-6">Últimos Productos</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {ultimosProductos.map((p) => (
            <a
              key={p.id}
              href={`/producto/${p.id}`}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4"
            >
              <img
                src={p.imagenes[0]?.imagen || "/img/default.jpg"}
                alt={p.nombre}
                className="w-full h-48 object-cover rounded-lg"
              />
              <h3 className="text-lg font-semibold mt-3">{p.nombre}</h3>
              <p className="text-green-700 font-bold">${p.precio} / kg</p>
            </a>
          ))}
        </div>
      </section>

      {/* ---------------------------------- */}
      {/*   CATEGORÍAS   */}
      {/* ---------------------------------- */}

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800">
            Categorías Destacadas
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            Explora nuestra selección de productos, organizados para que encuentres exactamente lo que buscas.
          </p>

          {/* Grid */}
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
                  {cat.descripcion?.length > 0
                    ? cat.descripcion
                    : "Explora nuestra selección de esta categoría."}
                </p>
              </a>
            ))}
          </div>

          {/* Botón Ver todas */}
          <div className="mt-12">
            <a
              href="/catalogo"
              className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition"
            >
              Ver todas las categorías
            </a>
          </div>
        </div>
      </section>


      {/* CTA FINAL */}
      <section className="text-center py-16 bg-green-50">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">
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
