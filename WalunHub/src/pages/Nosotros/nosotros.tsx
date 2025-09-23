export default function Nosotros() {
    return (
        <section className="pb-16 pt-10 overflow-hidden bg-gray-50 dark:bg-gray-800 sm:pt-16">
            <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                <div className="grid items-center grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Texto izquierdo */}
                    <div>
                        <h2 className="text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl lg:text-5xl">
                            Nuestra historia 🌱
                        </h2>
                        <p className="max-w-lg mt-4 text-xl leading-relaxed text-gray-600 dark:text-gray-300">
                            En WalunGranel creemos que la alimentación consciente comienza con ingredientes reales.
                            Nacimos con el propósito de ofrecer frutos secos y productos naturales que nutren el cuerpo
                            y respetan el planeta. Cada grano, cada semilla, cada nuez cuenta una historia de origen,
                            cuidado y sabor.
                        </p>

                        <p className="mt-6 text-xl text-gray-600 dark:text-gray-300">
                            <span className="relative inline-block">
                                <span className="absolute inline-block w-full bottom-0.5 h-2 bg-yellow-300 dark:bg-gray-900"></span>
                                <span className="relative font-semibold">¿Tienes preguntas?</span>
                            </span>
                            <br className="block sm:hidden" />
                            Escríbenos por{' '}
                            <a
                                href="https://wa.me/56912345678"
                                className="transition-all duration-200 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:underline"
                            >
                                WhatsApp
                            </a>
                        </p>
                    </div>

                    {/* Texto tipo Hero a la derecha */}
                    <div className="text-center md:text-right">
                        <span className="w-20 h-2 bg-gray-800 dark:bg-white mb-6 inline-block" />
                        <h1 className="uppercase text-6xl sm:text-7xl font-black leading-none text-gray-800 dark:text-white">
                            WaunGranel
                            <span className="text-4xl sm:text-5xl block">Frutos Secos</span>
                        </h1>
                        <p className="mt-4 text-base sm:text-lg text-gray-700 dark:text-gray-300">
                            Nutrición que nace de la tierra. Comprometidos con la calidad, el sabor y el bienestar.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}