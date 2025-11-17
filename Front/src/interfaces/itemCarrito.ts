export interface ItemCarrito {
  id: number;
  nombre: string;
  precio: number;      
  peso_kg?: number | string | null;     
  imagen: string;
  cantidad: number;
  stock: number;
}