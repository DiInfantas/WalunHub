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
import Dashboard from '../pages/dashboard/dashboard';
import Registro from '../pages/usuario/registro';
import Carrito from '../pages/carrito/carrito';
import Checkout from '../pages/checkout/checkout';
import Perfil from '../pages/usuario/perfil';
import ForgotPassword from '../pages/usuario/passmailto';
import ResetPassword from '../pages/usuario/recuperar';
import Success from "../pages/pago/Success";
import Failure from "../pages/pago/Failure";
import Pending from "../pages/pago/Pending";
import PedidoDetalle from "../pages/pago/pedidodetalle";
import NotFoundPage from '../components/layout/404';
import PedidoDetalleAdmin from '../pages/dashboard/pedidodetalleadmin';
import PedidoDetalleCliente from '../pages/pago/pedidodetalle';

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const hideMainNav = location.pathname.startsWith('/login') || location.pathname.startsWith('/gestion') || location.pathname.startsWith('/recuperarpass1') || location.pathname.startsWith('/recuperarpass2');

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
          <Route path="/recuperarpass1" element={<ForgotPassword />} />
          <Route path="/recuperarpass2" element={<ResetPassword />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/perfil" element={<Perfil/>} />
          <Route path="/pago/success" element={<Success />} />
          <Route path="/pago/failure" element={<Failure />} />
          <Route path="/pago/pending" element={<Pending />} />
          <Route path="/pedido/:id" element={<PedidoDetalle />} />
          <Route path="404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/admin/pedidos/:id" element={<PedidoDetalleAdmin />} />
          <Route path="/perfil/pedido/:id" element={<PedidoDetalleCliente />} />


        </Routes>
      </Layout>
    </Router>
  );

  
}