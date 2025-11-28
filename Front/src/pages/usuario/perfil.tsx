import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { actualizarPerfil, getPerfil, requestResetCode, resetPassword, api } from "../../config/api";
import { toastError, toastSuccess } from "../../interfaces/toast";

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
                active === item.id ? "bg-green-600 text-white" : "text-green-100 hover:bg-green-500 hover:text-white"
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
  const [user, setUser] = useState<any>(null);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const [formDataTemp, setFormDataTemp] = useState<any>(null);

  useEffect(() => {
    getPerfil()
      .then((data) => setUser(data))
      .catch((err) => console.error("Error al cargar perfil", err));
  }, []);

  useEffect(() => {
    api
      .get("/pedidos/mis/")
      .then((res) => setPedidos(res.data))
      .catch(() => toastError("Error al cargar tus pedidos"));
  }, []);

  const cardClass = "bg-white p-8 rounded-lg shadow-lg border-2 border-green-600";

  if (!user) {
    return (
      <div className="p-8 text-center">
        Error cargando el perfil (
        <a href="/login" className="text-green-700 font-semibold underline">
          Inicia Sesión
        </a>
        )...
      </div>
    );
  }

  const confirmarGuardado = async () => {
    if (!formDataTemp) return;

    try {
      await actualizarPerfil(formDataTemp);
      setShowModal(false);
      toastSuccess("Datos actualizados correctamente");
      setTimeout(() => {
        window.location.href = "/perfil";
      }, 1200);
    } catch {
      toastError("Error al actualizar la información");
    }
  };

  const ModalConfirmacion = () => (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-96 text-center shadow-xl border-2 border-green-600">
        <h2 className="text-xl font-bold text-green-700 mb-4">Confirmar cambios</h2>
        <p className="mb-6">¿Estás seguro de guardar estos cambios?</p>

        <div className="flex justify-between">
          <button
            onClick={() => setShowModal(false)}
            className="px-6 py-2 bg-red-300 text-gray-700 rounded hover:bg-red-400"
          >
            No
          </button>
          <button
            onClick={confirmarGuardado}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Sí, guardar
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (active) {
      case "info":
        return (
          <div className={cardClass}>
            <h2 className="text-2xl font-bold text-green-700 mb-6">
              Tu Información
            </h2>
            <p><strong>Nombre:</strong> {user.username}</p>
            <p><strong>Correo:</strong> {user.email}</p>
            <p><strong>Teléfono:</strong> {user.telefono}</p>
            <p><strong>Dirección:</strong> {user.direccion}</p>
            <p><strong>Comuna:</strong> {user.comuna}</p>
            <p><strong>Ciudad:</strong> {user.ciudad}</p>
            <p><strong>Código Postal:</strong> {user.codigo_postal}</p>
          </div>
        );

      case "password":
        return (
          <div className={cardClass}>
            <h2 className="text-2xl font-bold text-green-700 mb-6">Cambiar Clave</h2>
            <p className="mb-6 text-gray-700">
              Para cambiar tu contraseña, primero debes solicitar un código...
            </p>

            <div className="space-y-4 mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Correo electrónico</label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full p-4 bg-gray-100 border-2 border-green-600 rounded text-gray-500"
              />
              <button
                type="button"
                onClick={() => {
                  requestResetCode(user.email)
                    .then(() => toastSuccess("Código enviado a tu correo"))
                    .catch(() => toastError("Error al enviar el código"));
                }}
                className="w-full py-3 px-6 text-white font-bold bg-green-600 hover:bg-green-700 rounded"
              >
                Solicitar Código
              </button>
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);

                resetPassword(user.email, fd.get("code") as string, fd.get("new_password") as string)
                  .then(() => toastSuccess("Contraseña actualizada correctamente"))
                  .catch(() => toastError("Error al actualizar la contraseña"));
              }}
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Código</label>
                <input name="code" type="text" className="w-full p-4 border-2 border-green-600 rounded" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nueva contraseña</label>
                <input name="new_password" type="password" className="w-full p-4 border-2 border-green-600 rounded" />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 text-white font-bold bg-green-600 hover:bg-green-700 rounded"
              >
                Cambiar Clave
              </button>
            </form>
          </div>
        );

      case "edit":
        return (
          <div className={cardClass}>
            <h2 className="text-2xl font-bold text-green-700 mb-6">Editar Información</h2>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();

                const fd = new FormData(e.currentTarget);

                const datos = {
                  username: fd.get("username"),
                  email: fd.get("email"),
                  telefono: fd.get("telefono"),
                  direccion: fd.get("direccion"),
                  comuna: fd.get("comuna"),
                  ciudad: fd.get("ciudad"),
                  codigo_postal: fd.get("codigo_postal"),
                };

                setFormDataTemp(datos);
                setShowModal(true);
              }}
            >
              <div>
                <label className="block text-sm">Nombre</label>
                <input name="username" defaultValue={user.username} className="w-full p-4 border-2 border-green-600" />
              </div>

              <div>
                <label className="block text-sm">Correo</label>
                <input name="email" type="email" defaultValue={user.email} className="w-full p-4 border-2 border-green-600" />
              </div>

              <div>
                <label className="block text-sm">Teléfono</label>
                <input name="telefono" defaultValue={user.telefono} className="w-full p-4 border-2 border-green-600" />
              </div>

              <div>
                <label className="block text-sm">Dirección</label>
                <input name="direccion" defaultValue={user.direccion} className="w-full p-4 border-2 border-green-600" />
              </div>

              <div>
                <label className="block text-sm">Comuna</label>
                <input name="comuna" defaultValue={user.comuna} className="w-full p-4 border-2 border-green-600" />
              </div>

              <div>
                <label className="block text-sm">Ciudad</label>
                <input name="ciudad" defaultValue={user.ciudad} className="w-full p-4 border-2 border-green-600" />
              </div>

              <div>
                <label className="block text-sm">Código Postal</label>
                <input name="codigo_postal" defaultValue={user.codigo_postal} className="w-full p-4 border-2 border-green-600" />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 text-white font-bold bg-green-600 hover:bg-green-700 rounded"
              >
                Guardar Cambios
              </button>
            </form>

            {showModal && <ModalConfirmacion />}

            <Toaster />
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
                    <th className="px-4 py-2 text-green-700">Fecha</th>
                    <th className="px-4 py-2 text-green-700">Estado</th>
                    <th className="px-4 py-2 text-green-700">Método Pago</th>
                    <th className="px-4 py-2 text-green-700">Total</th>
                    <th className="px-4 py-2 text-green-700">Entrega</th>
                    <th className="px-4 py-2 text-green-700">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {pedidos.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="px-4 py-2">{p.id}</td>
                      <td className="px-4 py-2">{new Date(p.fecha).toLocaleDateString()}</td>
                      <td className="px-4 py-2">{p.estado}</td>
                      <td className="px-4 py-2">{p.metodo_pago}</td>
                      <td className="px-4 py-2">${p.total}</td>
                      <td className="px-4 py-2">{p.tipo_entrega}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => navigate(`/perfil/pedido/${p.id}`)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar active={active} setActive={setActive} />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-green-700 mb-8">
          Bienvenido, {user.username} a tu panel de gestión de cuenta!
        </h1>

        {renderContent()}
      </main>

      <Toaster position="top-center" />
    </div>
  );
};

export default Perfil;
