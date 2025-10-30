import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-green-700 text-white px-6 py-8 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
        {/* Marca */}
        <div>
          <h3 className="text-xl font-bold mb-2">WalunGranel</h3>
          <p className="text-sm">Nutrición que nace de la tierra 🌱</p>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="font-semibold mb-2">Contacto</h4>
          <p className="text-sm">+56 9 1234 5678</p>
          <p className="text-sm">contacto@walungranel.cl</p>
        </div>

        {/* Redes sociales */}
        <div>
          <h4 className="font-semibold mb-2">Síguenos</h4>
          <div className="flex justify-center md:justify-start gap-4 text-xl">
            <a href="https://www.facebook.com/people/_walungranel/100063572944042/" target="_blank" rel="noopener noreferrer" className="hover:text-green-300">
              <FaFacebook />
            </a>
            <a href="https://www.instagram.com/_walungranel/" target="_blank" rel="noopener noreferrer" className="hover:text-green-300">
              <FaInstagram />
            </a>
            <a href="https://wa.me/56986525272" target="_blank" rel="noopener noreferrer" className="hover:text-green-300">
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="mt-8 text-center text-sm text-green-100">
        &copy; {year} WalunGranel. Todos los derechos reservados.
      </div>
    </footer>
  );
}