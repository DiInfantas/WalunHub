// src/router/AppRouter.tsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import TopBar from '../components/layout/topbar';
import MainNav from '../components/layout/mainnav';
import Home from '../pages/Home/home';
import Footer from '../components/layout/footer';
import Catalogo from '../pages/catalogo/catalogo';
import Nosotros from '../pages/Nosotros/nosotros';
import Contacto from '../pages/Contacto/contacto';
import ProductoDetalle from '../pages/catalogo/productodetalle';
import Login from '../pages/usuario/login';
import Registro from '../pages/usuario/registro';

// Layout wrapper con lógica para ocultar MainNav
function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const hideMainNav = location.pathname.startsWith('/login') || location.pathname.startsWith('/gestion');

  return (
    <>
      <TopBar />
      {!hideMainNav && <MainNav />}
      <main>{children}</main>
      {!hideMainNav && <Footer />}
    </>
  );
}

export default function AppRouter() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </Routes>
      </Layout>
    </Router>
  );
}