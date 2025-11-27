import { useEffect, useState, useRef } from "react";
import { API_BASE_URL } from "../../config/api";
import heroImg from "../../assets/img/Hero.png";

type Imagen = { imagen: string };
type Producto = { id: number; nombre: string; precio?: number; destacado?: boolean; imagenes?: Imagen[] };
type Categoria = { id: number; nombre: string };

export default function Home(): JSX.Element {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [destacados, setDestacados] = useState<Producto[]>([]);
  const [ultimos, setUltimos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const catRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/productos/`).then((r) => r.json()),
      fetch(`${API_BASE_URL}/categorias/`).then((r) => r.json()),
    ])
      .then(([prod, cats]: any) => {
        setCategorias(cats || []);
        setDestacados((prod || []).filter((p: Producto) => p.destacado));
        setUltimos([...(prod || [])].sort((a, b) => b.id - a.id).slice(0, 8));
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const scrollCats = (dir: "left" | "right") => {
    if (!catRef.current) return;
    const { scrollLeft, clientWidth } = catRef.current;
    catRef.current.scrollTo({
      left: dir === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <main className="bg-white text-[#0f1b16] min-h-screen font-sans">
      {/* HERO */}
      <section className="bg-[#eef2ef] py-20 border-b border-[#dfe6e2]">
        <div className="container mx-auto px-6 lg:flex lg:items-center lg:gap-16">

          <div className="lg:w-1/2">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1c2b23] leading-tight">
              Ingredientes puros para una vida natural
            </h1>
            <p className="mt-4 text-lg text-[#4a5a52] max-w-xl">
              Productos a granel seleccionados con estándares de calidad superiores.
            </p>

            <div className="mt-6 flex gap-3">
              <a
                href="/catalogo"
                className="px-5 py-3 rounded-lg bg-[#2c5e49] text-white font-medium hover:bg-[#234a3a] transition"
              >
                Ver catálogo
              </a>

              <a
                href="/nosotros"
                className="px-5 py-3 rounded-lg border border-[#2c5e49] text-[#214433] hover:bg-[#f3f6f4]"
              >
                Conócenos
              </a>
            </div>
          </div>

          <div className="lg:w-1/2 mt-10 lg:mt-0 flex justify-center">
            <img src={heroImg} alt="Hero" className="w-80 rounded-2xl shadow-md" />
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { i: "🚚", t: "Despacho rápido", d: "Envío 24-48 horas" },
            { i: "🌱", t: "Natural y puro", d: "Ingredientes reales" },
            { i: "🏷️", t: "Precios justos", d: "Relación directa" },
            { i: "⭐", t: "Alta calidad", d: "Procesos controlados" },
          ].map((b) => (
            <div key={b.t} className="p-6 rounded-xl border bg-[#f8faf9] text-center shadow-sm">
              <div className="text-3xl mb-3">{b.i}</div>
              <h3 className="font-semibold text-[#1d2e25]">{b.t}</h3>
              <p className="text-sm text-[#4e5d55] mt-1">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="py-12 bg-[#f8faf9] border-y border-[#e5ebe7]">
        <div className="container mx-auto px-6 relative">
          <h2 className="text-2xl font-semibold text-center mb-6 text-[#1c2b23]">
            Categorías
          </h2>

          {/* Buttons desktop */}
          <button
            onClick={() => scrollCats("left")}
            className="hidden md:block absolute left-2 top-1/2 -translate-y-1/2 bg-[#2c5e49] text-white p-3 rounded-full"
          >
            ◀
          </button>

          <div
            ref={catRef}
            className="flex gap-5 overflow-x-auto py-4 snap-x px-2 scrollbar-hide"
          >
            {categorias.length ? (
              categorias.map((c) => (
                <div
                  key={c.id}
                  className="flex-shrink-0 w-48 snap-start bg-white p-6 rounded-xl border shadow-sm text-center hover:shadow-md transition"
                >
                  <div className="text-2xl mb-2">🥜</div>
                  <div className="font-medium text-[#1d2e25]">{c.nombre}</div>
                </div>
              ))
            ) : (
              <p className="text-center w-full">No hay categorías</p>
            )}
          </div>

          <button
            onClick={() => scrollCats("right")}
            className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 bg-[#2c5e49] text-white p-3 rounded-full"
          >
            ▶
          </button>
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-semibold text-center mb-10 text-[#1c2b23]">
            Productos destacados
          </h2>

          {loading ? (
            <p className="text-center">Cargando...</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {destacados.map((p) => (
                <article
                  key={p.id}
                  className="bg-[#f8faf9] border rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition"
                >
                  <img
                    src={p.imagenes?.[0]?.imagen || "/img/default.jpg"}
                    alt={p.nombre}
                    className="w-full h-52 object-cover"
                  />
                  <div className="p-5">
                    <h3 className="font-semibold text-[#1d2e25]">{p.nombre}</h3>
                    <p className="text-[#205038] font-bold mt-2">
                      ${p.precio?.toLocaleString("es-CL")}
                    </p>

                    <div className="mt-4 flex gap-2">
                      <a
                        href={`/producto/${p.id}`}
                        className="flex-1 text-center px-4 py-2 rounded-md border border-[#2c5e49] text-[#1f3e32] hover:bg-[#eef2ef] transition"
                      >
                        Ver
                      </a>

                      <button className="px-4 py-2 rounded-md bg-[#2c5e49] text-white">
                        🛒
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ÚLTIMOS */}
      <section className="py-14 bg-[#f8faf9] border-t border-[#e2eae6]">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-semibold text-center mb-10 text-[#1c2b23]">
            Últimos productos
          </h2>

          {loading ? (
            <p className="text-center">Cargando...</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {ultimos.map((p) => (
                <article
                  key={p.id}
                  className="bg-white border rounded-xl shadow-sm hover:shadow-lg transition text-center overflow-hidden"
                >
                  <img
                    src={p.imagenes?.[0]?.imagen || "/img/default.jpg"}
                    alt={p.nombre}
                    className="w-full h-52 object-cover"
                  />

                  <div className="p-5">
                    <h3 className="font-semibold text-[#1d2e25]">{p.nombre}</h3>
                    <p className="text-[#205038] font-bold mt-2">
                      ${p.precio?.toLocaleString("es-CL")}
                    </p>

                    <a
                      href={`/producto/${p.id}`}
                      className="inline-block mt-4 px-4 py-2 rounded-md border border-[#2c5e49] text-[#1f3e32] hover:bg-[#eef2ef] transition"
                    >
                      Ver producto
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-semibold text-center mb-10 text-[#1c2b23]">
            Testimonios
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { n: "Valentina", txt: "Productos de calidad increíble." },
              { n: "Diego", txt: "Super frescos y muy buen servicio." },
              { n: "Carla", txt: "Mis frutos secos favoritos." },
            ].map((t) => (
              <blockquote
                key={t.n}
                className="bg-[#f8faf9] border p-5 rounded-xl shadow-sm"
              >
                <p className="font-medium text-[#1d2e25]">{t.n}</p>
                <p className="text-sm text-[#4e5d55] mt-2">{t.txt}</p>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
      {/*Datos Nutri*/}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">
          Datos nutricionales que te encantará conocer
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          {/* TARJETA 1 */}
          <div className="bg-white p-7 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3 text-green-700">
              🥜 Frutos secos
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Ricos en grasas saludables, fibra y antioxidantes.
              Son una excelente fuente de energía de liberación lenta
              y ayudan a mejorar la salud del corazón.
            </p>
            <ul className="mt-4 text-sm text-gray-700 space-y-1">
              <li>• Altos en Omega-3</li>
              <li>• Proteínas vegetales</li>
              <li>• Minerales como magnesio y zinc</li>
            </ul>
          </div>

          {/* TARJETA 2 */}
          <div className="bg-white p-7 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3 text-green-700">
              🌾 Cereales y semillas
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Ideales para complementar comidas y aportar carbohidratos complejos.
              Favorecen la digestión y ayudan a mantener la saciedad.
            </p>
            <ul className="mt-4 text-sm text-gray-700 space-y-1">
              <li>• Fuente de fibra</li>
              <li>• Vitaminas del grupo B</li>
              <li>• Bajo índice glucémico</li>
            </ul>
          </div>

          {/* TARJETA 3 */}
          <div className="bg-white p-7 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3 text-green-700">
              🍫 Snacks saludables
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Alternativas sabrosas y naturales para acompañar tu día,
              con ingredientes reales y sin procesados innecesarios.
            </p>
            <ul className="mt-4 text-sm text-gray-700 space-y-1">
              <li>• Ingredientes naturales</li>
              <li>• Menos azúcar añadida</li>
              <li>• Apto para tu rutina diaria</li>
            </ul>
          </div>

        </div>
      </section>
      {/* CTA */}
      <section className="py-14 text-center bg-[#2c5e49] text-white">
        <h3 className="text-3xl font-semibold">Explora productos naturales premium</h3>
        <a
          href="/catalogo"
          className="mt-6 inline-block px-8 py-3 bg-white text-[#1f3e32] rounded-md text-lg hover:bg-[#f4f8f6]"
        >
          Ir al catálogo
        </a>
      </section>
    </main>
  );
}
