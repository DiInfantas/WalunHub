import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config/api';
import fotohero from '../../assets/img/Hero.png';

export default function Home() {
  const [destacados, setDestacados] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/productos/`)
      .then(res => res.json())
      .then(data => {
        const filtrados = data.filter((p: any) => p.destacado);
        setDestacados(filtrados);
      })
      .catch(err => console.error('Error al cargar productos destacados:', err));
  }, []);

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="dark:bg-gray-800 relative overflow-hidden">
        <div className="flex items-center relative z-20 overflow-hidden">
          <div className="container mx-auto px-6 flex flex-col-reverse lg:flex-row items-center py-16">
            {/* Texto */}
            <div className="lg:w-2/5 flex flex-col relative z-20 text-center lg:text-left">
              <span className="w-20 h-2 bg-gray-800 dark:bg-white mb-12 mx-auto lg:mx-0" />
              <h1 className="uppercase text-6xl sm:text-8xl font-black leading-none text-gray-800 dark:text-white">
                WalunGranel
                <span className="text-5xl sm:text-7xl block">Frutos Secos</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-700 dark:text-white mt-4">
                Nutrición que nace de la tierra 🌱. Explora nuestra variedad de frutos secos y productos naturales.
              </p>
              <div className="flex justify-center lg:justify-start mt-8">
                <a
                  href="/catalogo"
                  className="uppercase py-2 px-4 rounded-lg bg-green-600 border-2 border-transparent text-white text-md mr-4 hover:bg-green-500 transition"
                >
                  Ver productos
                </a>
                <a
                  href="/nosotros"
                  className="uppercase py-2 px-4 rounded-lg bg-transparent border-2 border-green-600 text-green-600 dark:text-white hover:bg-green-600 hover:text-white text-md transition"
                >
                  Conócenos
                </a>
              </div>
            </div>

            {/* Imagen */}
            <div className="lg:w-3/5 hidden sm:block relative">
              <img
                src={fotohero}
                alt="Plato con frutos secos"
                className="max-w-xs md:max-w-sm mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Productos destacados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {destacados.map((producto: any) => (
            <div key={producto.id} className="bg-green-50 rounded-lg shadow p-4 text-center">
              <img
                src={producto.imagenes[0]?.imagen || '/img/default.jpg'}
                alt={producto.nombre}
                className="w-full h-40 object-cover rounded mb-4 transform transition-transform duration-300 hover:scale-105"
              />
              <h3 className="text-lg font-semibold text-gray-800">{producto.nombre}</h3>
              <p className="text-green-700 font-bold mt-2">${producto.precio}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}