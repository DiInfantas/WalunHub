import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaChevronDown } from "react-icons/fa";
import { useEffect, useState } from "react";
import { api } from "../../config/api";
import Logo from "../../assets/img/logo.png";


interface ModalProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onConfirm: () => void;
  onClose: () => void;
}

function Modal({ open, title, children, onConfirm, onClose }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
        <h2 className="text-xl font-bold mb-3">{title}</h2>

        <div className="mb-4">{children}</div>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-green-600 text-white py-2 rounded"
          >
            Sí
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white py-2 rounded"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TopBar() {
  const [username, setUsername] = useState<string | null>(null);
  const [esVendedor, setEsVendedor] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/usuarios/perfil/")
      .then((res) => {
        setUsername(res.data.username);
        setEsVendedor(res.data.es_vendedor);
      })
      .catch(() => {
        setUsername(null);
        setEsVendedor(false);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/usuarios/logout/");
    } catch {}

    localStorage.removeItem("token");
    setUsername(null);
    setEsVendedor(false);
    localStorage.removeItem("carrito");
    navigate("/login");
  };

  return (
    <>
      <Modal
        open={logoutModal}
        title="Cerrar sesión"
        onConfirm={() => {
          setLogoutModal(false);
          handleLogout();
        }}
        onClose={() => setLogoutModal(false)}
      >
        <p>¿Seguro que quieres cerrar sesión?</p>
      </Modal>

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
              <span className="font-semibold hidden sm:block">
                Hola, {username}
              </span>
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
                  className={`transition-transform duration-200 ${
                    menuOpen ? "rotate-180" : "rotate-0"
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

                      {esVendedor && (
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 hover:bg-green-100 font-semibold"
                          onClick={() => setMenuOpen(false)}
                        >
                          Panel de gestión
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          setLogoutModal(true);
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
    </>
  );
}
