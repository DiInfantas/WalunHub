import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../config/api";
import ProductosPanel from "../dashboard/productospanel";
import CategoriasPanel from "./categoriaspanel";
import PedidosPanel from "./pedidospanel";
import CuentasPanel from "./cuentaspanel";
import ContactosPanel from "./contactospanel";
import { toastError } from "../../interfaces/toast";

/**
 * DashboardDueña.tsx
 * - Sidebar desktop fijo
 * - Sidebar móvil deslizable (off-canvas) que aparece al pulsar un botón dentro del contenido
 * - Comprueba autorización (api)
 * - Mantiene los panels que tenías
 */

const menuItems = [
  { id: "productos", label: "Productos" },
  { id: "pedidos", label: "Pedidos" },
  { id: "categorias", label: "Categorías" },
  { id: "cuentas", label: "Cuentas de clientes" },
  { id: "contactos", label: "Contactos" },
];

type MenuId = "productos" | "pedidos" | "categorias" | "cuentas" | "contactos";

// Sidebar deslizante (móvil)
const SidebarSlide: React.FC<{
  active: MenuId;
  setActive: (s: MenuId) => void;
  open: boolean;
  close: () => void;
}> = ({ active, setActive, open, close }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-40 transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        } sm:hidden`}
        onClick={close}
        aria-hidden={!open}
      />

      {/* Panel */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-green-700 text-white shadow-lg p-5 transform transition-transform duration-300 sm:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Panel de Gestión</h2>
          <button
            onClick={close}
            aria-label="Cerrar menú"
            className="text-white/90 bg-green-800 px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {menuItems.map((it) => (
            <button
              key={it.id}
              onClick={() => {
                setActive(it.id as MenuId);
                close();
              }}
              className={`w-full text-left px-4 py-2 rounded-md font-medium text-sm ${
                active === it.id
                  ? "bg-green-600 text-white"
                  : "text-green-100 hover:bg-green-600/70"
              }`}
            >
              {it.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

// Sidebar para desktop
const SidebarDesktop: React.FC<{
  active: MenuId;
  setActive: (s: MenuId) => void;
}> = ({ active, setActive }) => {
  return (
    <aside className="hidden sm:flex w-64 bg-green-700 text-white flex-col shadow-lg">
      <div className="p-6 border-b border-green-600">
        <span className="text-2xl font-bold">Panel de Gestión</span>
      </div>

      <nav className="mt-5 px-2 flex-1">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id as MenuId)}
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
  const [active, setActive] = useState<MenuId>("productos");
  const [openSidebar, setOpenSidebar] = useState(false);
  const [autorizado, setAutorizado] = useState<null | boolean>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/usuarios/panel/")
      .then(() => setAutorizado(true))
      .catch(() => {
        toastError("Acceso restringido: solo para cuentas de gestión");
        navigate("/");
      });
  }, [navigate]);

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
      case "contactos":
        return <ContactosPanel />;
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
      {/* Sidebar slide (móvil) */}
      <SidebarSlide
        active={active}
        setActive={setActive}
        open={openSidebar}
        close={() => setOpenSidebar(false)}
      />

      {/* Sidebar desktop */}
      <SidebarDesktop active={active} setActive={setActive} />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        {/* Botón + mini topbar para móvil */}
        <div className="sm:hidden flex items-center justify-between mb-4">
          <button
            onClick={() => setOpenSidebar(true)}
            className="bg-green-700 text-white px-4 py-2 rounded-lg shadow"
            aria-expanded={openSidebar}
            aria-controls="sidebar"
          >
            Menú
          </button>

          <span className="font-bold text-green-700">Panel de gestión</span>
        </div>

        {/* Título (desktop) */}
        <h1 className="hidden sm:block text-3xl font-bold text-green-700 mb-6">
          Panel de gestión de WalunGranel
        </h1>

        {/* Contenedor principal del panel */}
        <div className="min-h-[200px]">{renderContent()}</div>
      </main>
    </div>
  );
};

export default DashboardDueña;
