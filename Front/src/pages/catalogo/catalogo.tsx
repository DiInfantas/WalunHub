import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../../config/api";
import type { Producto as ProductoType } from "../../interfaces/producto";
import type { Categoria as CategoriaType } from "../../interfaces/categoria";
import { Toaster } from "react-hot-toast";
import { agregarAlCarrito } from "../carrito/carritoUtils";
import { toastError, toastSuccess } from "../../interfaces/toast";

export default function Catalogo(): JSX.Element {
  const [productos, setProductos] = useState<ProductoType[]>([]);
  const [categorias, setCategorias] = useState<CategoriaType[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [selectedOrden, setSelectedOrden] = useState<"asc" | "desc">("asc");
  const [appliedCat, setAppliedCat] = useState<string>("all");
  const [appliedOrden, setAppliedOrden] = useState<"asc" | "desc">("asc");

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE_URL}/productos/`).then((r) => r.json()),
      fetch(`${API_BASE_URL}/categorias/`).then((r) => r.json()),
    ])
      .then(([prodData, catData]: any) => {
        setProductos(Array.isArray(prodData) ? prodData : []);
        setCategorias(Array.isArray(catData) ? catData : []);
      })
      .catch((err) => console.error("Error cargando catálogo:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleApplyFilters = () => {
    setAppliedCat(selectedCat);
    setAppliedOrden(selectedOrden);
    setMobileOpen(false);
  };

  const handleResetFilters = () => {
    setSelectedCat("all");
    setSelectedOrden("asc");
    setAppliedCat("all");
    setAppliedOrden("asc");
  };

  const productosFiltrados = useMemo(() => {
    let list = [...productos];

    if (appliedCat !== "all") {
      const catId = Number(appliedCat);
      list = list.filter((p) => Number(p.categoria) === catId);
    }

    list.sort((a, b) => {
      const pa = Number(a.precio ?? 0);
      const pb = Number(b.precio ?? 0);
      return appliedOrden === "asc" ? pa - pb : pb - pa;
    });

    return list;
  }, [productos, appliedCat, appliedOrden]);

  // Fallback de imágenes
  const getImage = (p: ProductoType) =>
    p.imagenes?.[0]?.imagen || "/img/default.jpg";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nuestro catálogo</h1>
          <p className="text-sm text-gray-600 mt-1">
            Encuentra presentaciones en bolsas con peso definido.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden inline-flex items-center gap-2 px-3 py-2 border rounded-md bg-white text-sm shadow-sm"
          >
            ⚙️ Filtros
          </button>

          <button
            onClick={handleResetFilters}
            className="hidden md:inline-flex items-center px-3 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-50"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* SPINNER */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* SIDEBAR */}
          <aside className="hidden md:block md:col-span-3">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white border rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold mb-3">Categoría</h4>
                <select
                  value={selectedCat}
                  onChange={(e) => setSelectedCat(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  <option value="all">Todas</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-white border rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold mb-3">Ordenar</h4>
                <select
                  value={selectedOrden}
                  onChange={(e) =>
                    setSelectedOrden(e.target.value as "asc" | "desc")
                  }
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  <option value="asc">Menor a mayor</option>
                  <option value="desc">Mayor a menor</option>
                </select>
              </div>

              <button
                onClick={handleApplyFilters}
                className="w-full px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
              >
                Aplicar filtros
              </button>
            </div>
          </aside>

          {/* PRODUCTS */}
          <div className="md:col-span-9">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {productosFiltrados.map((producto) => {
                const stock = Number(producto.stock ?? 0);
                const isOut = stock <= 0;

                const addToCart = () => {
                  if (isOut) {
                    toastError("No hay stock disponible");
                    return;
                  }

                  const token = localStorage.getItem("token");
                  if (!token) {
                    toastError("Debes iniciar sesión");
                    return;
                  }

                  agregarAlCarrito({
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    imagen: getImage(producto),
                    cantidad: 1,
                    stock: producto.stock,
                    peso_kg: producto.peso_kg,
                  });

                  toastSuccess("Producto agregado al carrito");
                };

                return (
                  <div
                    key={producto.id}
                    className="group flex flex-col bg-white rounded-xl shadow-sm border hover:shadow-md transition p-3 h-full"
                  >
                    {/* IMAGEN */}
                    <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-gray-100">
                      {/* BADGE DESTACADO */}
                      {producto.destacado && (
                        <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow z-10">
                          ⭐ Destacado
                        </span>
                      )}

                      {/* BADGE POCO STOCK */}
                      {producto.stock > 0 && producto.stock <= 5 && (
                        <span
                          className={`absolute ${
                            producto.destacado ? "top-10" : "top-2"
                          } left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow z-10`}
                        >
                          ⚠️ Poco stock
                        </span>
                      )}

                      <img
                        src={getImage(producto)}
                        alt={producto.nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>

                    {/* CONTENIDO */}
                    <div className="flex flex-col flex-grow mt-3">
                      <h3 className="text-lg font-semibold text-gray-800 leading-tight line-clamp-1">
                        {producto.nombre}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Bolsa de {Number(producto.peso_kg)} kg
                      </p>

                      <p className="text-xl font-bold text-green-700 mt-2">
                        ${producto.precio.toLocaleString("es-CL")}
                      </p>

                      <button
                        onClick={addToCart}
                        disabled={isOut}
                        className={`mt-auto w-full py-2 rounded-lg font-semibold text-white transition ${
                          isOut
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {isOut ? "Sin stock" : "Agregar al carrito"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MOBILE FILTERS */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-lg p-4 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Filtros</h4>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-gray-600"
              >
                Cerrar ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Categoría
                </label>
                <select
                  value={selectedCat}
                  onChange={(e) => setSelectedCat(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  <option value="all">Todas</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Orden
                </label>
                <select
                  value={selectedOrden}
                  onChange={(e) =>
                    setSelectedOrden(e.target.value as "asc" | "desc")
                  }
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  <option value="asc">Menor a mayor</option>
                  <option value="desc">Mayor a menor</option>
                </select>
              </div>

              <button
                onClick={handleApplyFilters}
                className="w-full px-4 py-2 rounded-md bg-green-600 text-white"
              >
                Aplicar
              </button>

              <button
                onClick={handleResetFilters}
                className="w-full px-4 py-2 rounded-md border"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
