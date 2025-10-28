export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  destacado: boolean;
  activo: boolean;
  imagenes: { imagen: string }[];
}