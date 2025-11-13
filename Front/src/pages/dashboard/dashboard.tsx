import React, { useEffect, useState } from "react";
import axios from "axios";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

const Dashboard: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8000/api/productos/") // Ajusta la URL según tu backend
      .then((res) => {
        // Si tu API devuelve { results: [...] } por la paginación de DRF
        const data = res.data.results || res.data;
        setProductos(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside style={{
        width: "220px",
        background: "#222",
        color: "#fff",
        padding: "1rem"
      }}>
        <h2>Dashboard</h2>
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li><a href="/dashboard" style={{ color: "#fff" }}>Productos</a></li>
            <li><a href="/perfil" style={{ color: "#fff" }}>Perfil</a></li>
            <li><a href="/pedidos" style={{ color: "#fff" }}>Pedidos</a></li>
          </ul>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main style={{ flex: 1, padding: "2rem" }}>
        <h1>Lista de productos</h1>
        {loading ? (
          <p>Cargando productos...</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>${p.precio}</td>
                  <td>{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
