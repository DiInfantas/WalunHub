// src/router/AppRouter.tsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import TopBar from '../components/layout/topbar';
import MainNav from '../components/layout/mainnav';
import Home from '../pages/Home/home';

// Layout wrapper con lógica para ocultar MainNav
function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const hideMainNav = location.pathname.startsWith('/login') || location.pathname.startsWith('/gestion');

  return (
    <>
      <TopBar />
      {!hideMainNav && <MainNav />}
      <main>{children}</main>
    </>
  );
}

export default function AppRouter() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Agrega más rutas aquí */}
        </Routes>
      </Layout>
    </Router>
  );
}