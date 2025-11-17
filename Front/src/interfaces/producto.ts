export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;        
  precio_kg: number;     
  peso_kg: number;       
  stock: number;
  categoria: string;
  destacado: boolean;
  activo: boolean;
  imagenes: { imagen: string }[];
}