import React, { useState } from "react";

interface SidebarProps {
  active: string;
  setActive: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ active, setActive }) => {
  const menuItems = [
    { id: "productos", label: "Productos" },
    { id: "pedidos", label: "Pedidos" },
    { id: "categorias", label: "Categorías" },
    { id: "cuentas", label: "Cuentas de clientes" },
    { id: "reportes", label: "Reportes" },
    { id: "logout", label: "Cerrar Sesión" },
  ];

  return (
    <aside className="w-64 bg-green-700 text-white flex flex-col shadow-lg">
      <div className="p-6 border-b border-green-600">
        <span className="text-2xl font-bold">Panel de Gestión</span>
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

const DashboardDueña: React.FC = () => {
  const [active, setActive] = useState("productos");

  const cardClass =
    "bg-white p-8 rounded-lg shadow-lg border-2 border-green-600";

  const renderContent = () => {
    switch (active) {
      case "productos":
        return (
          <div className={cardClass}>
            <h2 className="text-2xl font-bold text-green-700 mb-6">Gestión de Productos</h2>
            <p>Aquí la dueña puede ver, crear, editar y eliminar productos.</p>
            {/* Ejemplo: tabla de productos */}
            <table className="min-w-full border-2 border-green-600 rounded mt-4">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-4 py-2 text-green-700">ID</th>
                  <th className="px-4 py-2 text-green-700">Nombre</th>
                  <th className="px-4 py-2 text-green-700">Precio</th>
                  <th className="px-4 py-2 text-green-700">Stock</th>
                  <th className="px-4 py-2 text-green-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2">1</td>
                  <td className="px-4 py-2">Harina Integral</td>
                  <td className="px-4 py-2">$2.500</td>
                  <td className="px-4 py-2">30</td>
                  <td className="px-4 py-2">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Editar</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case "pedidos":
        return (
          <div className={cardClass}>
            <h2 className="text-2xl font-bold text-green-700 mb-6">Gestión de Pedidos</h2>
            <p>Aquí la dueña puede revisar y actualizar el estado de los pedidos.</p>
          </div>
        );
      case "categorias":
        return (
          <div className={cardClass}>
            <h2 className="text-2xl font-bold text-green-700 mb-6">Gestión de Categorías</h2>
            <p>Aquí la dueña puede crear y editar categorías de productos.</p>
          </div>
        );
      case "cuentas":
        return (
          <div className={cardClass}>
            <h2 className="text-2xl font-bold text-green-700 mb-6">Gestión de Cuentas</h2>
            <p>Aquí la dueña puede administrar las cuentas de clientes.</p>
          </div>
        );
      case "reportes":
        return (
          <div className={cardClass}>
            <h2 className="text-2xl font-bold text-green-700 mb-6">Reportes</h2>
            <p>Aquí la dueña puede ver estadísticas de ventas y actividad.</p>
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
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-green-700 mb-8">
          Panel de gestión de WalunGranel
        </h1>
        {renderContent()}
      </main>
    </div>
  );
};

export default DashboardDueña;