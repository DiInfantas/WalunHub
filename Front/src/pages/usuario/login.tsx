import { useState } from "react";
import { api } from "../../config/api";  // 👈 ruta corregida

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/usuarios/login/", { email, password });
      localStorage.setItem("token", res.data.token);
      alert("Login exitoso");
      window.location.href = "/";
    } catch (err: any) {
      console.error(err.response?.data);
      alert("Credenciales inválidas");
    }
  };

  return (
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
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border-2 border-green-600 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 text-white font-bold bg-green-600 hover:bg-green-700 rounded"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
