import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useEffect, useState } from "react";
import { api } from "../../config/api";  // 👈 ruta corregida

export default function TopBar() {
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/usuarios/perfil/")
      .then((res) => setUsername(res.data.username))
      .catch(() => setUsername(null));
  }, []);

  const handleLogout = async () => {
    const confirmLogout = window.confirm("¿Seguro que quieres cerrar sesión?");
    if (confirmLogout) {
      try {
        await api.post("/usuarios/logout/");
      } catch {
        // aunque falle, igual borramos el token
      }
      localStorage.removeItem("token");
      setUsername(null);
      navigate("/login");
    }
  };

  return (
    <div className="bg-green-700 text-white px-6 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">WalunGranel</Link>
        <div className="flex gap-4 items-center">
          {username ? (
            <>
              <span className="font-semibold">Hola, {username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:text-green-300 transition">
              <FaUser size={20} />
            </Link>
          )}
          <Link to="/carrito" className="hover:text-green-300 transition">
            <FaShoppingCart size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
