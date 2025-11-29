import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../../config/api";
import type { Producto as ProductoType } from "../../interfaces/producto";
import type { Categoria as CategoriaType } from "../../interfaces/categoria";
import { Link } from "react-router-dom";

/**
 * Catálogo rediseñado
 * - Sidebar (desktop) + off-canvas (mobile)
 * - Aplicar filtros con botón
 * - Cards con peso, precio por bolsa y precio/kg calculado
 * - Responsive grid 2/3/4/5
 */

export default function Catalogo(): JSX.Element {
  const [productos, setProductos] = useState<ProductoType[]>([]);
  const [categorias, setCategorias] = useState<CategoriaType[]>([]);
  const [loading, setLoading] = useState(true);

  // Controles (selección previa antes de aplicar)
  const [selectedCat, setSelectedCat] = useState<string>("all"); // 'all' o string(id)
  const [selectedOrden, setSelectedOrden] = useState<"asc" | "desc">("asc");

  // Filtros aplicados (los que realmente filtran la lista)
  const [appliedCat, setAppliedCat] = useState<string>("all");
  const [appliedOrden, setAppliedOrden] = useState<"asc" | "desc">("asc");

  // Mobile filters drawer
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

  // Aplica filtros cuando el usuario pulsa 'Aplicar filtros'
  const handleApplyFilters = () => {
    setAppliedCat(selectedCat);
    setAppliedOrden(selectedOrden);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Limpia filtros
  const handleResetFilters = () => {
    setSelectedCat("all");
    setSelectedOrden("asc");
    setAppliedCat("all");
    setAppliedOrden("asc");
  };

  // Map de categorías por id para mostrar nombre
  const categoriaMap = useMemo(() => {
    const m: Record<number, CategoriaType> = {};
    categorias.forEach((c) => (m[c.id] = c));
    return m;
  }, [categorias]);

  // Productos filtrados/aplicados (por appliedCat / appliedOrden)
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

  // Helpers
  const formatCurrency = (n: number | string) =>
    new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(Number(n));

  const parsePesoKg = (peso_kg: string | number | undefined) => {
    const f = parseFloat(String(peso_kg ?? "0")) || 0;
    return f;
  };

  const displayPeso = (peso_kg: string | number | undefined) => {
    const kg = parsePesoKg(peso_kg);
    if (kg >= 1) return `${kg % 1 === 0 ? kg.toFixed(0) : kg} kg`;
    const gramos = Math.round(kg * 1000);
    return `${gramos} g`;
  };

  const precioPorKg = (precioBolsa: number, peso_kg: string | number | undefined) => {
    const kg = parsePesoKg(peso_kg);
    if (!kg || kg <= 0) return null;
    const precioKg = Math.round((precioBolsa / kg));
    return precioKg;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header / acciones */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nuestro catálogo</h1>
          <p className="text-sm text-gray-600 mt-1">
            Encuentra presentaciones en bolsas con peso definido. Si necesitas más cantidad, selecciona múltiples bolsas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile: abrir filtros */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden inline-flex items-center gap-2 px-3 py-2 border rounded-md bg-white text-sm shadow-sm"
            aria-label="Abrir filtros"
          >
            ⚙️ Filtros
          </button>

          {/* Reset quick */}
          <button
            onClick={handleResetFilters}
            className="hidden md:inline-flex items-center px-3 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-50"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* SIDEBAR - DESKTOP */}
        <aside className="hidden md:block md:col-span-3 lg:col-span-3">
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
                onChange={(e) => setSelectedOrden(e.target.value as "asc" | "desc")}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="asc">Precio: menor a mayor</option>
                <option value="desc">Precio: mayor a menor</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleApplyFilters}
                className="flex-1 px-4 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700"
              >
                Aplicar filtros
              </button>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-md border text-sm hover:bg-gray-50"
              >
                Limpiar
              </button>
            </div>
          </div>
        </aside>

        {/* PRODUCTS GRID */}
        <div className="md:col-span-9 lg:col-span-9">
          {/* Small filter bar on top for desktop and mobile */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              {loading ? "Cargando productos..." : `${productosFiltrados.length} resultado(s)`}
            </div>
            <div className="hidden md:flex items-center gap-3">
              <label className="text-sm text-gray-600">Orden:</label>
              <select
                value={selectedOrden}
                onChange={(e) => setSelectedOrden(e.target.value as "asc" | "desc")}
                className="border rounded px-3 py-1 text-sm"
              >
                <option value="asc">Menor a mayor</option>
                <option value="desc">Mayor a menor</option>
              </select>
              <button onClick={handleApplyFilters} className="px-3 py-1 bg-green-600 text-white rounded-md text-sm">Aplicar</button>
            </div>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {productosFiltrados.map((producto) => {
              const stock = Number(producto.stock ?? 0);
              const kg = parsePesoKg(producto.peso_kg);
              const gramos = Math.round(kg * 1000);
              const pKg = precioPorKg(Number(producto.precio ?? 0), producto.peso_kg);
              const isOut = stock <= 0;
              const lowStock = stock > 0 && stock <= 5;

              return (
                <div
                  key={producto.id}
                  className="w-full bg-white rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all border border-gray-100"
                >
                  <a href={`/producto/${producto.id}`}>
                    {/* Contenedor cuadrado */}
                    <div className="relative w-full aspect-square overflow-hidden rounded-t-xl">
                      <img
                        src={producto.imagenes[0]?.imagen || "/img/default.jpg"}
                        alt={producto.nombre}
                        className="w-full h-full object-cover"
                      />

                      {/* BADGES sobre la foto (arriba-izquierda) */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {producto.destacado && (
                          <span className="bg-yellow-200/90 text-yellow-900 text-xs font-semibold px-2 py-1 rounded-lg shadow">
                            ⭐ Destacado
                          </span>
                        )}

                        {/* Poco stock (solo si stock > 0 y <= 5) */}
                        {producto.stock > 0 && producto.stock <= 5 && (
                          <span className="bg-orange-200/90 text-orange-900 text-xs font-semibold px-2 py-1 rounded-lg shadow">
                            ⚠️ Poco stock
                          </span>
                        )}
                      </div>
                    </div>
                  </a>

                  {/* INFO */}
                  <div className="p-4 flex flex-col gap-2">

                    {/* Nombre */}
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {producto.nombre}
                    </h3>

                    {/* Precio + Peso */}
                    <p className="text-green-700 font-bold">
                      ${producto.precio.toLocaleString()}{" "}
                      <span className="text-gray-600 text-sm font-medium">
                        ({producto.peso_kg} kg)
                      </span>
                    </p>

                    {/* Botón */}
                    <button
                      disabled={producto.stock <= 0}
                      className={`w-full mt-2 py-2 rounded-lg text-white font-semibold transition-all ${producto.stock <= 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                        }`}
                    >
                      {producto.stock <= 0 ? "Sin stock" : "Agregar al carrito"}
                    </button>
                  </div>
                </div>


              );
            })}
          </div>
        </div>
      </div>

      {/* MOBILE OFF-CANVAS FILTERS */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-lg p-4 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Filtros</h4>
              <button onClick={() => setMobileOpen(false)} className="text-gray-600">Cerrar ✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Categoría</label>
                <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)} className="w-full border rounded px-3 py-2 text-sm">
                  <option value="all">Todas</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={String(c.id)}>{c.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Orden</label>
                <select value={selectedOrden} onChange={(e) => setSelectedOrden(e.target.value as "asc" | "desc")} className="w-full border rounded px-3 py-2 text-sm">
                  <option value="asc">Precio: menor a mayor</option>
                  <option value="desc">Precio: mayor a menor</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button onClick={handleApplyFilters} className="flex-1 px-4 py-2 rounded-md bg-green-600 text-white">Aplicar</button>
                <button onClick={handleResetFilters} className="px-4 py-2 rounded-md border">Limpiar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
