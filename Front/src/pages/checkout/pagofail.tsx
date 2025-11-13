import { useState, useEffect } from "react";

export default function PagoRechazado() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (loading) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            // ✅ Redirigir al carrito
            window.location.href = "/carrito";
            return 100;
          }
          return prev + 5;
        });
      }, 150);
    }
    return () => clearInterval(timer);
  }, [loading]);

  return (
    <main>
      {/* Encabezado */}
      <header className="bg-red-600 text-white text-center py-12">
        <h1 className="text-4xl font-bold mt-16">Tu pago ha sido rechazado</h1>
      </header>

      {/* Contenido principal */}
      <section className="text-center py-16 px-4">
        <p className="text-gray-700 text-lg mb-8">
          Lamentablemente tu pago no pudo ser procesado.  
          Puedes volver al carrito para intentar nuevamente.
        </p>

        {!loading ? (
          <button
            onClick={() => {
              setLoading(true);
              setProgress(0);
            }}
            className="bg-green-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-green-700 transition-colors font-bold"
          >
            Volver al carrito
          </button>
        ) : (
          <div className="max-w-md mx-auto mt-8">
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className="bg-green-600 h-6 transition-all duration-150"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="mt-4 text-gray-700 font-semibold">
              Redirigiendo al carrito...
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
