import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../config/api";
import ProductosPanel from "../dashboard/productospanel";
import CategoriasPanel from "./categoriaspanel";
import PedidosPanel from "./pedidospanel";
import CuentasPanel from "./cuentaspanel";

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
    { id: "reportes", label: "Reportes (Proximamente)" },
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
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${active === item.id
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
  const [autorizado, setAutorizado] = useState<null | boolean>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/usuarios/panel/")
      .then(() => setAutorizado(true))
      .catch(() => {
        alert("Acceso restringido: solo para cuentas de gestión");
        navigate("/");
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("es_vendedor");
    api.post("/usuarios/logout/").catch(() => { });
    setActive("logout");
  };

  const cardClass =
    "bg-white p-8 rounded-lg shadow-lg border-2 border-green-600";

  const renderContent = () => {
    switch (active) {
      case "productos":
        return <ProductosPanel />;
      case "pedidos":
        return <PedidosPanel />;
      case "categorias":
        return <CategoriasPanel />;
      case "cuentas":
        return <CuentasPanel />;
      case "reportes":
        return (
          <div className={cardClass}>
            <h2 className="text-2xl font-bold text-green-700 mb-6">Reportes (Proximamente)</h2>
            <p>Aquí la dueña puede ver estadísticas de ventas y actividad.</p>
          </div>
        );
      case "logout":
        return (
          <div className={cardClass}>
            <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
              Sesión cerrada
            </h2>
            <p className="text-center text-gray-700">
              Has cerrado sesión. Vuelve al{" "}
              <a
                href="/"
                className="text-green-600 hover:underline font-semibold"
              >
                inicio
              </a>.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  if (autorizado === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Verificando acceso...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        active={active}
        setActive={(section) => {
          if (section === "logout") {
            handleLogout();
          } else {
            setActive(section);
          }
        }}
      />
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