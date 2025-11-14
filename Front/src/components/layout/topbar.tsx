import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useEffect, useState } from "react";
import { api } from "../../config/api";
import { FaChevronDown } from "react-icons/fa";
import Logo from "../../assets/img/logo.png";

export default function TopBar() {
  const [username, setUsername] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/usuarios/perfil/")
      .then((res) => setUsername(res.data.username))
      .catch(() => setUsername(null));
  }, []);

  const handleLogout = async () => {
    const confirmLogout = window.confirm("¿Seguro que quieres cerrar sesión?");
    if (!confirmLogout) return;

    try {
      await api.post("/usuarios/logout/");
    } catch { }

    localStorage.removeItem("token");
    setUsername(null);
    navigate("/login");
  };

  return (
    <div className="bg-white text-green-800 px-6 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={Logo}
            alt="WalunGranel Logo"
            className="h-16 w-auto rounded-full border-2 border-green-800 shadow-md"
          />
          <span className="text-2xl font-bold">WalunGranel</span>
        </Link>

        <div className="flex gap-6 items-center">
          {username && (
            <span className="font-semibold hidden sm:block">Hola, {username}</span>
          )}

          <Link
            to="/carrito"
            className="flex items-center gap-2 hover:text-green-600 transition"
          >
            <FaShoppingCart size={20} />
            <span className="text-sm font-medium">Carrito</span>
          </Link>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-1 hover:text-green-600 transition"
            >
              <FaUser size={20} />
              <FaChevronDown
                className={`transition-transform duration-200 ${menuOpen ? "rotate-180" : "rotate-0"
                  }`}
                size={14}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-green-800 rounded-lg shadow-lg border border-green-200 z-20">
                {!username ? (
                  <>
                    <Link
                      to="/registro"
                      className="block px-4 py-2 hover:bg-green-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Crear cuenta
                    </Link>
                    <Link
                      to="/login"
                      className="block px-4 py-2 hover:bg-green-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Iniciar sesión
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/perfil"
                      className="block px-4 py-2 hover:bg-green-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Gestionar cuenta
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                    >
                      Cerrar sesión
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


