import fotohero from '../../assets/img/Hero.png';
import castana from '../../assets/img/castañas.png';
import variado from '../../assets/img/variado.png';
export default function Home() {
    return (
        <main className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="bg-indigo-50 shadow-md flex flex-col-reverse md:flex-row items-center justify-between px-8 py-16 shadow-inner rounded-lg">
                {/* Texto */}
                <div className="md:w-1/2 text-gray-800 text-center md:text-left">
                    <h1 className="text-5xl font-bold mb-4">WalunGranel</h1>
                    <p className="text-xl mb-6">
                        Explora nuestra variedad de frutos secos de alta calidad 🌰
                    </p>
                    <a
                        href="/catalogo"
                        className="inline-block bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
                    >
                        Ver productos
                    </a>
                </div>

                {/* Imagen */}
                <div className="md:w-1/2 flex justify-center mb-8 md:mb-0">
                    <img
                        src={fotohero}
                        alt="Plato con frutos secos"
                        className="w-64 h-64 rounded-full object-cover shadow-lg"
                    />
                </div>
            </section>

            {/* Productos destacados */}
            <section className="px-8 py-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Productos destacados</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {/* Producto ejemplo */}
                    <div className="bg-green-50 rounded-lg shadow p-4 text-center">
                        <img
                            src={castana}
                            alt="Cashews"
                            className="w-full h-40 object-cover rounded mb-4 transform transition-transform duration-300 hover:scale-105"
                        />
                        <h3 className="text-lg font-semibold text-gray-800">Castañas de Cajú</h3>
                        <p className="text-green-700 font-bold mt-2">$10.000</p>
                    </div>

                    {/* Repite para otros productos */}
                    <div className="bg-green-50 rounded-lg shadow p-4 text-center">
                        <img src={variado} alt="Almendras" className="w-full h-40 object-cover rounded mb-4 transform transition-transform duration-300 hover:scale-105"

                        />
                        <h3 className="text-lg font-semibold text-gray-800">Almendras</h3>
                        <p className="text-green-700 font-bold mt-2">$10.000</p>
                    </div>

                    <div className="bg-green-50 rounded-lg shadow p-4 text-center">
                        <img src={castana} alt="Nueces" className="w-full h-40 object-cover rounded mb-4 transform transition-transform duration-300 hover:scale-105"

                        />
                        <h3 className="text-lg font-semibold text-gray-800">Nueces</h3>
                        <p className="text-green-700 font-bold mt-2">$15.000</p>
                    </div>

                    <div className="bg-green-50 rounded-lg shadow p-4 text-center">
                        <img src={variado} alt="Damasco seco" className="w-full h-40 object-cover rounded mb-4 transform transition-transform duration-300 hover:scale-105"

                        />
                        <h3 className="text-lg font-semibold text-gray-800">Damasco seco</h3>
                        <p className="text-green-700 font-bold mt-2">$8.000</p>
                    </div>
                </div>
            </section>
        </main>
    );
}