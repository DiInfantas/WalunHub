import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import type { Producto } from "../../interfaces/producto";
import { api } from "../../config/api";
import { agregarAlCarrito } from "../carrito/carritoUtils";
import { Toaster } from "react-hot-toast";
import { toastError, toastSuccess } from "../../interfaces/toast";

// 🟢 Formato de peso bonito
const formatPeso = (peso: string | number) => {
  const num = Number(peso);
  if (num < 1) return `${num * 1000} g`;
  return `${num} kg`;
};

function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [productosRelacionados, setProductosRelacionados] = useState<Producto[]>([]);

  // 🟦 referencia del carrusel
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    api.get(`/productos/${id}/`)
      .then((res) => {
        setProducto(res.data);

        if (res.data.stock === 0) {
          setCantidad(0);
        }

        // 🟦 Cargar relacionados sin repetir producto actual
        api.get(`/productos/`).then((res2) => {
          const todos = res2.data as Producto[];
          const relacionados = todos
            .filter(
              (p) =>
                p.id !== res.data.id &&
                p.categoria === res.data.categoria &&
                p.activo
            )
            .slice(0, 12);

          setProductosRelacionados(relacionados);
        });
      })
      .catch(() => setError("Producto no encontrado"));
  }, [id]);


  if (!producto) return <p className="text-center mt-10">Cargando producto...</p>;
  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>;

  const disponible = producto.stock >= 1;

  const handleAddToCart = () => {
    if (!producto) return;

    if (!disponible) {
      toastError("No hay stock disponible");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toastError("Debes iniciar sesión para agregar al carrito");
      return;
    }

    agregarAlCarrito({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagenes[0]?.imagen || "/img/default.jpg",
      cantidad,
      stock: producto.stock,
      peso_kg: producto.peso_kg,
    });

    toastSuccess("Producto agregado al carrito");
  };

  // 🟦 Flechas del carrusel
  const scrollCarousel = (dir: "left" | "right") => {
    if (!carouselRef.current) return;
    const amount = 260; // cuánto scrollea
    carouselRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Toaster position="top-center" />

      <div className="grid md:grid-cols-2 gap-10">
        {/* Imagen */}
        <img
          src={producto.imagenes[0]?.imagen || "/img/default.jpg"}
          alt={producto.nombre}
          className="w-full h-96 object-cover rounded-xl shadow-lg"
        />

        {/* Info */}
        <div>
          <h1 className="text-4xl font-bold text-green-900 mb-2">{producto.nombre}</h1>

          <h3 className="text-md text-green-700 font-semibold mb-4">
            Bolsa x {formatPeso(producto.peso_kg)}
          </h3>

          <p className="text-gray-700 mb-4 leading-relaxed text-lg">{producto.descripcion}</p>

          <p className="text-3xl font-bold text-green-700 mb-3">${producto.precio}</p>

          <p className="text-sm text-gray-600 mb-5">
            {disponible ? "Hay stock disponible" : "Sin stock disponible"}
          </p>

          {/* Cantidad */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setCantidad(Math.max(1, cantidad - 1))}
              className="px-3 py-1 bg-gray-200 rounded text-xl disabled:opacity-50"
              disabled={!disponible || cantidad <= 1}
            >
              −
            </button>

            <span className="text-xl font-semibold">{cantidad}</span>

            <button
              onClick={() => setCantidad(cantidad + 1)}
              className="px-3 py-1 bg-gray-200 rounded text-xl disabled:opacity-50"
              disabled={!disponible}
            >
              +
            </button>
          </div>

          {/* Botón */}
          <button
            onClick={handleAddToCart}
            disabled={!disponible}
            className={`w-full py-3 rounded-xl text-white font-semibold text-lg transition ${!disponible
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 shadow-md"
              }`}
          >
            {disponible ? "Agregar al carrito" : "Sin stock"}
          </button>
        </div>
      </div>

      {/* Productos relacionados */}
      {productosRelacionados.length > 0 && (
        <section className="mt-14 relative">
          <h2 className="text-2xl font-bold text-green-900 mb-5">Te podría interesar</h2>

          {/* Botones flecha */}
          <button
            onClick={() => scrollCarousel("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-2 hover:scale-110 transition"
          >
            ◀
          </button>

          <button
            onClick={() => scrollCarousel("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-2 hover:scale-110 transition"
          >
            ▶
          </button>

          {/* Carrusel */}
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-gray-100 scroll-smooth"
          >
            {productosRelacionados.map((p) => (
              <div
                key={p.id}
                className="min-w-[220px] bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col"
                style={{ height: "350px" }} // ← Altura fija del card
              >
                {/* Imagen cuadrada */}
                <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={p.imagenes[0]?.imagen || "/img/default.jpg"}
                    alt={p.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Contenido */}
                <div className="flex flex-col flex-1 mt-3">

                  {/* Nombre → altura fija */}
                  <h3 className="font-semibold text-gray-900 text-lg truncate h-6">
                    {p.nombre}
                  </h3>

                  {/* Bolsa x kg → altura fija */}
                  <p className="text-green-700 text-sm font-medium h-5">
                    Bolsa x {formatPeso(p.peso_kg)}
                  </p>

                  {/* Descripción → altura fija */}
                  <p className="text-gray-600 text-sm line-clamp-2 h-10">
                    {p.descripcion}
                  </p>

                  {/* Precio → altura fija */}
                  <p className="text-green-700 font-bold text-lg mt-auto mb-2 h-6">
                    ${p.precio}
                  </p>

                  {/* Botón */}
                  <a
                    href={`/producto/${p.id}`}
                    className="block text-center bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 transition h-10"
                  >
                    Ver producto
                  </a>
                </div>
              </div>

            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductoDetalle;
