import { useState } from "react";
import { api } from "../../config/api";
import { toastError, toastSuccess } from "../../interfaces/toast";
import { Toaster } from "react-hot-toast";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/usuarios/login/", { email, password });
      localStorage.setItem("token", res.data.token);

      toastSuccess("Login exitoso");

      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err: any) {
      console.error(err.response?.data);
      toastError("Credenciales inválidas");
    }
  };

  return (
    <>
      <div className="container px-4 mx-auto py-12">
        <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
            Iniciar sesión
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border-2 border-green-600 rounded"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">
                Contraseña
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 border-2 border-green-600 rounded pr-12"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 text-white font-bold bg-green-600 hover:bg-green-700 rounded"
            >
              Ingresar
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              ¿Olvidaste tu contraseña?{" "}
              <a
                href="/recuperarpass1"
                className="text-green-600 font-semibold hover:underline"
              >
                Recuperar contraseña
              </a>
            </p>
                        <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <a
                href="/registro"
                className="text-green-600 font-semibold hover:underline"
              >
                Crear Cuenta
              </a>
            </p>
          </div>
        </div>
      </div>

      <Toaster position="top-center" />
    </>
  );
}