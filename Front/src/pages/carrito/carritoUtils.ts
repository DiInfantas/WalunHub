import type { ItemCarrito } from "../../interfaces/itemCarrito";

export const obtenerCarrito = (): ItemCarrito[] => {
  return JSON.parse(localStorage.getItem('carrito') || '[]');
};

export const guardarCarrito = (carrito: ItemCarrito[]) => {
  localStorage.setItem('carrito', JSON.stringify(carrito));
};

export const agregarAlCarrito = (producto: ItemCarrito) => {
  const carrito = obtenerCarrito();
  const existe = carrito.find(p => p.id === producto.id);

  if (existe) {
    existe.cantidad += 1;
  } else {
          carrito.push({ 
        ...producto, 
        cantidad: 1,
        stock: producto.stock 
      });

  }

  guardarCarrito(carrito);
};

export const eliminarDelCarrito = (id: number) => {
  const carrito = obtenerCarrito().filter(p => p.id !== id);
  guardarCarrito(carrito);
};

export const vaciarCarrito = () => {
  localStorage.removeItem('carrito');
};