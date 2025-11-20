import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { actualizarPerfil, getPerfil, requestResetCode, resetPassword, api } from "../../config/api"; // Ajusta la ruta si es necesario

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

const Perfil: React.FC = () => {
  const [active, setActive] = useState("info");
  const [user, setUser] = useState<any>(null);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getPerfil()
      .then((data) => setUser(data))
      .catch((err) => console.error("Error al cargar perfil", err));
  }, []);

  useEffect(() => {
    api
      .get("/pedidos/mis/")
      .then((res) => setPedidos(res.data))
      .catch(() => toast.error("Error al cargar tus pedidos"));
  }, []);

  const cardClass = "bg-white p-8 rounded-lg shadow-lg border-2 border-green-600";

  if (!user) {
    return <div className="p-8 text-center">Cargando perfil...</div>;
  }

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
              Para cambiar tu contraseña, primero debes solicitar un código de verificación que será enviado a tu correo electrónico. Luego, ingresa ese código junto con tu nueva contraseña.
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
                    .then(() => alert("Código enviado a tu correo"))
                    .catch(() => alert("Error al enviar el código"));
                }}
                className="w-full py-3 px-6 text-white font-bold bg-green-600 hover:bg-green-700 rounded transition duration-200"
              >
                Solicitar Código
              </button>
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const datos = {
                  email: user.email,
                  code: formData.get("code"),
                  new_password: formData.get("new_password"),
                };
                resetPassword(datos.email, datos.code as string, datos.new_password as string)
                  .then(() => alert("Contraseña actualizada correctamente"))
                  .catch(() => alert("Error al actualizar la contraseña"));
              }}
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Código de verificación</label>
                <input
                  name="code"
                  type="text"
                  placeholder="Ingresa el código recibido por correo"
                  className="w-full p-4 border-2 border-green-600 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nueva contraseña</label>
                <input
                  name="new_password"
                  type="password"
                  placeholder="Ingresa tu nueva contraseña"
                  className="w-full p-4 border-2 border-green-600 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 px-6 text-white font-bold bg-green-600 hover:bg-green-700 rounded transition duration-200"
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
                const formData = new FormData(e.currentTarget);
                const datos = {
                  username: formData.get("username"),
                  email: formData.get("email"),
                  telefono: formData.get("telefono"),
                  direccion: formData.get("direccion"),
                  comuna: formData.get("comuna"),
                  ciudad: formData.get("ciudad"),
                  codigo_postal: formData.get("codigo_postal"),
                };
                actualizarPerfil(datos)
                  .then(() => alert("Información actualizada correctamente"))
                  .catch(() => alert("Error al actualizar la información"));
              }}
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
                <input name="username" type="text" defaultValue={user.username} className="w-full p-4 border-2 border-green-600 rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Correo electrónico</label>
                <input name="email" type="email" defaultValue={user.email} className="w-full p-4 border-2 border-green-600 rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
                <input name="telefono" type="text" defaultValue={user.telefono} className="w-full p-4 border-2 border-green-600 rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Dirección</label>
                <input name="direccion" type="text" defaultValue={user.direccion} className="w-full p-4 border-2 border-green-600 rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Comuna</label>
                <input name="comuna" type="text" defaultValue={user.comuna} className="w-full p-4 border-2 border-green-600 rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ciudad</label>
                <input name="ciudad" type="text" defaultValue={user.ciudad} className="w-full p-4 border-2 border-green-600 rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Código Postal</label>
                <input name="codigo_postal" type="text" defaultValue={user.codigo_postal} className="w-full p-4 border-2 border-green-600 rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <button type="submit" className="w-full py-3 px-6 text-white font-bold bg-green-600 hover:bg-green-700 rounded transition duration-200">
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
          Bienvenido, {user.username} a tu panel de gestión de cuenta!
        </h1>
        {renderContent()}
      </main>
    </div>
  );
};

export default Perfil;