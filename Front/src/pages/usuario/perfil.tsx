import React, { useState } from "react";

interface SidebarProps {
  active: string;
  setActive: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ active, setActive }) => {
  const menuItems = [
    { id: "info", label: "Tu Información" },
    { id: "password", label: "Cambiar Clave" },
    { id: "edit", label: "Editar Información" },
    { id: "orders", label: "Tus Pedidos" },
    { id: "logout", label: "Cerrar Sesión" },
  ];

  return (
    <aside className="w-64 bg-green-700 text-white flex flex-col shadow-lg">
      <div className="p-6 border-b border-green-600">
        <span className="text-2xl font-bold">Panel</span>
      </div>
      <nav className="mt-5 px-2 flex-1">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                active === item.id
                  ? "bg-green-600 text-white"
                  : "text-green-100 hover:bg-green-500 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
};

const Perfil: React.FC = () => {
  const [active, setActive] = useState("info");

  const user = {
    nombre: "Juan",
    apellido: "Pérez",
    correo: "juanperez@mail.com",
    telefono: "+56 9 1234 5678",
    direccion: "Av. Siempre Viva 123",
  };

  const pedidos = [
    {
      id: 1,
      cliente: "Juan Pérez",
      fecha: "2025-11-12",
      estado: "Entregado",
      metodoPago: "Tarjeta",
      total: "$50.000",
      entrega: "Domicilio",
    },
    {
      id: 2,
      cliente: "Juan Pérez",
      fecha: "2025-11-10",
      estado: "Pendiente",
      metodoPago: "Transferencia",
      total: "$30.000",
      entrega: "Retiro en tienda",
    },
  ];

  const cardClass =
    "bg-white p-8 rounded-lg shadow-lg border-2 border-green-600";

  const renderContent = () => {
    switch (active) {
      case "info":
        return (
          <div className={cardClass}>
            <h2 className="text-2xl font-bold text-green-700 mb-6">
              Tu Información
            </h2>
            <p><strong>Nombre:</strong> {user.nombre} {user.apellido}</p>
            <p><strong>Correo:</strong> {user.correo}</p>
            <p><strong>Teléfono:</strong> {user.telefono}</p>
            <p><strong>Dirección:</strong> {user.direccion}</p>
          </div>
        );
      case "password":
        return (
          <div className={cardClass}>
            <h2 className="text-2xl font-bold text-green-700 mb-6">Cambiar Clave</h2>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Correo (username)"
                className="w-full p-4 border-2 border-green-600 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button className="w-full py-3 px-6 text-white font-bold bg-green-600 hover:bg-green-700 rounded transition duration-200">
                Enviar
              </button>
            </form>
          </div>
        );
      case "edit":
        return (
          <div className={cardClass}>
            <h2 className="text-2xl font-bold text-green-700 mb-6">Editar Información</h2>
            <form className="space-y-4">
              <input type="text" defaultValue={user.nombre} className="w-full p-4 border-2 border-green-600 rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
              <input type="text" defaultValue={user.apellido} className="w-full p-4 border-2 border-green-600 rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
              <input type="email" defaultValue={user.correo} className="w-full p-4 border-2 border-green-600 rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
              <input type="text" defaultValue={user.telefono} className="w-full p-4 border-2 border-green-600 rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
              <input type="text" defaultValue={user.direccion} className="w-full p-4 border-2 border-green-600 rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
              <button className="w-full py-3 px-6 text-white font-bold bg-green-600 hover:bg-green-700 rounded transition duration-200">
                Guardar Cambios
              </button>
            </form>
          </div>
        );
      case "orders":
        return (
          <div className={cardClass}>
            <h2 className="text-2xl font-bold text-green-700 mb-6">Tus Pedidos</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border-2 border-green-600 rounded">
                <thead className="bg-green-100">
                  <tr>
                    <th className="px-4 py-2 text-green-700">ID</th>
                    <th className="px-4 py-2 text-green-700">Cliente</th>
                    <th className="px-4 py-2 text-green-700">Fecha</th>
                    <th className="px-4 py-2 text-green-700">Estado</th>
                    <th className="px-4 py-2 text-green-700">Método Pago</th>
                    <th className="px-4 py-2 text-green-700">Total</th>
                    <th className="px-4 py-2 text-green-700">Entrega</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="px-4 py-2">{p.id}</td>
                      <td className="px-4 py-2">{p.cliente}</td>
                      <td className="px-4 py-2">{p.fecha}</td>
                      <td className="px-4 py-2">{p.estado}</td>
                      <td className="px-4 py-2">{p.metodoPago}</td>
                      <td className="px-4 py-2">{p.total}</td>
                      <td className="px-4 py-2">{p.entrega}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "logout":
        return (
          <div className={cardClass}>
            <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Sesión cerrada</h2>
            <p className="text-center text-gray-700">
              Has cerrado sesión. Vuelve al{" "}
              <a href="/" className="text-green-600 hover:underline font-semibold">
                Home
              </a>.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar active={active} setActive={setActive} />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-green-700 mb-8">
          Bienvenido, {user.nombre} a tu panel de gestión de cuenta!
        </h1>
        {renderContent()}
      </main>
    </div>
  );
};

export default Perfil;

