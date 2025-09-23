import { Link } from 'react-router-dom';

export default function MainNav() {
  return (
    <div className="bg-green-600 text-white px-6 py-2 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-center gap-8 font-medium">
        <Link to="/" className="hover:text-green-300 transition">Inicio</Link>
        <Link to="/catalogo" className="hover:text-green-300 transition">Productos</Link>
        <Link to="/nosotros" className="hover:text-green-300 transition">Nosotros</Link>
        <Link to="/contacto" className="hover:text-green-300 transition">Contacto</Link>
      </div>
    </div>
  );
}