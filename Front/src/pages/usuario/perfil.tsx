import React, { useEffect, useState } from "react";
import axios from "axios";

interface PerfilUsuario {
  username: string;
  email: string;
  telefono: string;
  direccion?: string;
  comuna?: string;
  ciudad?: string;
  codigo_postal?: string;
}

const Perfil: React.FC = () => {
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aquí deberías usar el token del usuario
    axios.get("/api/usuarios/perfil/", {
      headers: { Authorization: `Token ${localStorage.getItem("token")}` }
    })
    .then(res => {
      setPerfil(res.data);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (perfil) {
      setPerfil({ ...perfil, [e.target.name]: e.target.value });
    }
  };

  const handleSave = () => {
    axios.put("/api/usuarios/perfil/", perfil, {
      headers: { Authorization: `Token ${localStorage.getItem("token")}` }
    })
    .then(() => alert("Perfil actualizado"))
    .catch(() => alert("Error al actualizar perfil"));
  };

  if (loading) return <p>Cargando perfil...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Mi Perfil</h1>
      {perfil && (
        <form>
          <label>Nombre de usuario: {perfil.username}</label><br />
          <label>Email: {perfil.email}</label><br />
          <input
            type="text"
            name="telefono"
            value={perfil.telefono}
            onChange={handleChange}
            placeholder="Teléfono"
          /><br />
          <input
            type="text"
            name="direccion"
            value={perfil.direccion || ""}
            onChange={handleChange}
            placeholder="Dirección"
          /><br />
          <input
            type="text"
            name="comuna"
            value={perfil.comuna || ""}
            onChange={handleChange}
            placeholder="Comuna"
          /><br />
          <input
            type="text"
            name="ciudad"
            value={perfil.ciudad || ""}
            onChange={handleChange}
            placeholder="Ciudad"
          /><br />
          <input
            type="text"
            name="codigo_postal"
            value={perfil.codigo_postal || ""}
            onChange={handleChange}
            placeholder="Código Postal"
          /><br />
          <button type="button" onClick={handleSave}>Guardar cambios</button>
        </form>
      )}
    </div>
  );
};

export default Perfil;
