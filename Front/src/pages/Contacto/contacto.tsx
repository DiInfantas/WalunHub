import { useState } from "react";
import { api } from "../../config/api";
import toast, { Toaster } from "react-hot-toast";

export default function Contacto() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/contacto/enviar/", { nombre, email, mensaje });
      toast.success("Mensaje enviado correctamente");
      setNombre("");
      setEmail("");
      setMensaje("");
    } catch (err) {
      toast.error("Error al enviar el mensaje");
    }
  };

  return (
    <main>
      <Toaster position="top-right" />

      {/* Encabezado */}
      <header className="bg-green-700 text-white text-center py-12">
        <h1 className="text-4xl font-bold mt-16">Contáctanos</h1>
      </header>

      {/* Métodos de contacto */}
      <section className="text-center py-12 px-4">
        <h2 className="text-2xl font-bold">Estamos aquí para ayudarte</h2>
        <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
          Puedes comunicarte con nosotros por cualquiera de los siguientes medios. ¡Será un gusto atenderte!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
          <div className="p-4 shadow-lg rounded-lg bg-green-100 hover:bg-green-200 transition-colors">
            <h3 className="text-xl font-bold">Teléfono</h3>
            <p className="text-gray-700 mt-2">+56 9 1234 5678</p>
          </div>
          <div className="p-4 shadow-lg rounded-lg bg-green-100 hover:bg-green-200 transition-colors">
            <h3 className="text-xl font-bold">Correo</h3>
            <p className="text-gray-700 mt-2">contacto@walungranel.cl</p>
          </div>
          <div className="p-4 shadow-lg rounded-lg bg-green-100 hover:bg-green-200 transition-colors">
            <h3 className="text-xl font-bold">Dirección</h3>
            <p className="text-gray-700 mt-2">Portugal 87, Santiago</p>
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section className="bg-gray-100 py-12 px-4">
        <h2 className="text-2xl font-bold text-center">Envíanos un mensaje</h2>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-8 space-y-8">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-bold">Nombre</label>
            <input
              type="text"
              id="name"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full mt-2 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 font-bold">Correo electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-2 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-gray-700 font-bold">Mensaje</label>
            <textarea
              id="message"
              rows={5}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              required
              className="w-full mt-2 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-3 rounded-lg shadow-lg hover:bg-green-600 transition-colors"
          >
            Enviar mensaje
          </button>
        </form>
      </section>

      {/* Preguntas frecuentes */}
      <section className="text-center py-12 px-4">
        <h2 className="text-2xl font-bold">Preguntas frecuentes</h2>
        <div className="mt-8">
          <div className="p-4 border rounded-lg shadow-md transition transform hover:scale-100 scale-95">
            <h3 className="text-xl font-bold">¿Cuál es el horario de atención?</h3>
            <p className="mt-2 text-gray-700">De lunes a viernes, de 9:00 a 18:00 hrs.</p>
          </div>
          <div className="p-4 border rounded-lg shadow-md transition transform hover:scale-100 scale-95 mt-4">
            <h3 className="text-xl font-bold">¿Hacen envíos a regiones?</h3>
            <p className="mt-2 text-gray-700">Sí, realizamos envíos a todo Chile a través de Bluexpress</p>
          </div>
          <div className="p-4 border rounded-lg shadow-md transition transform hover:scale-100 scale-95 mt-4">
            <h3 className="text-xl font-bold">¿Puedo comprar por WhatsApp?</h3>
            <p className="mt-2 text-gray-700">Claro, escríbenos y te ayudamos a realizar tu pedido directamente.</p>
          </div>
        </div>
      </section>
    </main>
  );
}