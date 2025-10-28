import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Aquí puedes conectar con tu backend usando fetch o axios
    console.log('Login con:', { email, password });
  };

  return (
    <div className="container px-4 mx-auto">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold">Iniciar Sesión</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 font-extrabold">Correo</label>
            <input
              type="email"
              placeholder="Ingresa tu correo aquí"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="inline-block w-full p-4 leading-6 text-lg font-extrabold placeholder-indigo-900 bg-white shadow border-2 border-indigo-900 rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-extrabold">Contraseña</label>
            <input
              type="password"
              placeholder="**********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="inline-block w-full p-4 leading-6 text-lg font-extrabold placeholder-indigo-900 bg-white shadow border-2 border-indigo-900 rounded"
              required
            />
          </div>
          <div className="flex flex-wrap -mx-4 mb-6 items-center justify-between">
            <div className="w-full lg:w-auto px-4 mb-4 lg:mb-0">
              <label>
                <input type="checkbox" />
                <span className="ml-1 font-extrabold">Recuerdame</span>
              </label>
            </div>
            <div className="w-full lg:w-auto px-4">
              <a className="inline-block font-extrabold hover:underline" href="#">
                Olvidaste tu contraseña?
              </a>
            </div>
          </div>
          <button
            type="submit"
            className="inline-block w-full py-4 px-6 mb-6 text-center text-lg leading-6 text-white font-extrabold bg-indigo-800 hover:bg-indigo-900 border-3 border-indigo-900 shadow rounded transition duration-200"
          >
            Entrar
          </button>
          <p className="text-center font-extrabold">
            No tienes una cuenta ?{' '}
            <br />
            <a className="text-red-500 hover:underline" href="/registro">
              Crear una cuenta
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}