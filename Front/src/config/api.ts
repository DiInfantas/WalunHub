import axios from "axios";

export const API_BASE_URL = "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para añadir token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});


export const requestResetCode = async (email: string) => {
  const res = await api.post("/usuarios/send-reset-code/", { email });
  return res.data;
};

// Confirmar código y actualizar contraseña
export const resetPassword = async (
  email: string,
  code: string,
  newPassword: string
) => {
  const res = await api.post("/usuarios/reset-password/", {
    email,
    code,
    new_password: newPassword,
  });
  return res.data;
};