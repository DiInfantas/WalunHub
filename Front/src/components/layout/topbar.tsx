import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';

export default function TopBar() {
  return (
    <div className="bg-green-700 text-white px-6 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Marca */}
        <Link to="/" className="text-2xl font-bold">
          WalunGranel
        </Link>

        {/* Íconos */}
        <div className="flex gap-4 items-center">
          <Link to="/login" className="hover:text-green-300 transition">
            <FaUser size={20} />
          </Link>
          <Link to="/carrito" className="hover:text-green-300 transition">
            <FaShoppingCart size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}