import { useState, useEffect } from "react";

export default function PagoAprobado() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (loading) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            window.location.href = "/perfil";
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
      <header className="bg-green-700 text-white text-center py-12">
        <h1 className="text-4xl font-bold mt-16">Tu pago ha sido aprobado</h1>
      </header>

      {/* Contenido principal */}
      <section className="text-center py-16 px-4">
        <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
          ¡Gracias por tu compra!  
          Para más información anda a la sección <strong>Tus Pedidos</strong> en tu panel de gestión para ver el detalle de tu compra.
        </p>

        {!loading ? (
          <button
            onClick={() => {
              setLoading(true);
              setProgress(0);
            }}
            className="bg-green-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-green-700 transition-colors font-bold"
          >
            Ir a Tus Pedidos
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
              Redirigiendo a Tus Pedidos...
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
