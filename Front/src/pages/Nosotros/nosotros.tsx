export default function Nosotros() {
    return (
        <section className="pb-20 pt-12 overflow-hidden bg-white">
            <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">

                {/* GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

                    {/* IZQUIERDA */}
                    <div className="space-y-6">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                            Nuestra historia 🌱
                        </h2>

                        <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                            En WalunGranel creemos que la alimentación consciente comienza con ingredientes reales.
                            Nacimos con el propósito de ofrecer frutos secos y productos naturales que nutren el cuerpo
                            y respetan el planeta. Cada grano, cada semilla, cada nuez cuenta una historia de origen,
                            cuidado y sabor.
                        </p>

                        <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                            <span className="font-semibold relative inline-block">
                                <span className="absolute -bottom-1 left-0 w-full h-2 bg-yellow-300 opacity-60 rounded-md"></span>
                                <span className="relative z-10">¿Tienes preguntas?</span>
                            </span>
                            <br className="block sm:hidden" />
                            Escríbenos por{" "}
                            <a
                                href="https://wa.me/56912345678"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 font-semibold hover:underline"
                            >
                                WhatsApp
                            </a>
                        </p>
                    </div>

                    {/* DERECHA */}
                    <div className="flex flex-col items-center lg:items-end text-center lg:text-right">

                        <div className="w-24 h-1 bg-green-600 mb-4 rounded-full" />

                        <h1 className="
                            uppercase 
                            text-5xl sm:text-6xl md:text-6xl lg:text-7xl 
                            font-black tracking-tight 
                            text-gray-900 leading-none
                        ">
                            WalunGranel
                            <span className="
                                block 
                                text-3xl sm:text-4xl md:text-4xl lg:text-5xl 
                                mt-2 text-green-700
                            ">
                                Frutos Secos
                            </span>
                        </h1>

                        <p className="mt-5 text-base sm:text-lg text-gray-700 max-w-md">
                            Nutrición que nace de la tierra. Comprometidos con la calidad, el sabor y el bienestar.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
