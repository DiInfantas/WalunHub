import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login con:', { email, password });
  };

  return (
    <div className="container px-4 mx-auto py-12">
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-green-700">Iniciar sesión</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700">Correo electrónico</label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border-2 border-green-600 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700">Contraseña</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border-2 border-green-600 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 text-white font-bold bg-green-600 hover:bg-green-700 rounded transition duration-200"
          >
            Iniciar sesión
          </button>
          <p className="text-center mt-6 text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <a href="/registro" className="text-green-600 hover:underline font-semibold">
              Regístrate aquí
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}