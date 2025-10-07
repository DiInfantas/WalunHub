import { useState } from 'react';
import castana from '../../assets/img/castañas.png';
import variado from '../../assets/img/variado.png';

export default function Catalogo() {
  const [categoria, setCategoria] = useState('todos');
  const [orden, setOrden] = useState('asc');

  const productos = [
    { nombre: 'Castañas de Cajú', precio: 10000, categoria: 'frutos secos', imagen:castana  },
    { nombre: 'Almendras', precio: 10000, categoria: 'frutos secos', imagen: variado },
    { nombre: 'Nueces', precio: 15000, categoria: 'frutos secos', imagen:castana },
    { nombre: 'Damasco seco', precio: 8000, categoria: 'deshidratados', imagen: variado },
  ];

  // Filtrar y ordenar productos
  const productosFiltrados = productos
    .filter(p => categoria === 'todos' || p.categoria === categoria)
    .sort((a, b) => orden === 'asc' ? a.precio - b.precio : b.precio - a.precio);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Nuestro catálogo</h2>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
        <div>
          <label className="font-semibold mr-2">Categoría:</label>
          <select
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="todos">Todos</option>
            <option value="frutos secos">Frutos secos</option>
            <option value="deshidratados">Deshidratados</option>
          </select>
        </div>
        <div>
          <label className="font-semibold mr-2">Ordenar por precio:</label>
          <select
            value={orden}
            onChange={e => setOrden(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="asc">Menor a mayor</option>
            <option value="desc">Mayor a menor</option>
          </select>
        </div>
      </div>

      {/* Tarjetas de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-20 gap-x-10 justify-items-center">
        {productosFiltrados.map((producto, index) => (
          <div key={index} className="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
            <a href="#">
              <img src={producto.imagen} alt={producto.nombre} className="h-80 w-72 object-cover rounded-t-xl" />
              <div className="px-4 py-3 w-72">
                <span className="text-gray-400 uppercase text-xs">WaunGranel</span>
                <p className="text-lg font-bold text-black truncate block capitalize">{producto.nombre}</p>
                <div className="flex items-center">
                  <p className="text-lg font-semibold text-black my-3">${producto.precio}/kg</p>
                  <div className="ml-auto text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-bag-plus" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z" />
                      <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}