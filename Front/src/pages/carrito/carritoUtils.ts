import type { ItemCarrito } from "../../interfaces/itemCarrito";

export const obtenerCarrito = (): ItemCarrito[] => {
  const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

  return carrito.map((item: ItemCarrito) => {
    const rawPeso = item.peso_kg ?? 0;

    const pesoParseado =
      typeof rawPeso === "string"
        ? parseFloat(rawPeso.replace(",", "."))
        : Number(rawPeso);

    return {
      ...item,
      peso_kg: isNaN(pesoParseado) ? 0 : pesoParseado, // siempre número
    };
  });
};

export const guardarCarrito = (carrito: ItemCarrito[]) => {
  localStorage.setItem('carrito', JSON.stringify(carrito));
};

export const agregarAlCarrito = (producto: ItemCarrito) => {
  const carrito = obtenerCarrito();
  const existe = carrito.find(p => p.id === producto.id);

  const rawPeso = producto.peso_kg ?? 0;

  const pesoParseado =
    typeof rawPeso === "string"
      ? parseFloat(rawPeso.replace(",", "."))
      : Number(rawPeso);

  const peso_kg = isNaN(pesoParseado) ? 0 : pesoParseado;

  if (existe) {
    existe.cantidad += producto.cantidad;
  } else {
    carrito.push({
      ...producto,
      cantidad: producto.cantidad,
      stock: producto.stock,
      peso_kg,
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

export const calcularPesoTotal = (carrito: ItemCarrito[]) => {
  return carrito.reduce(
    (suma, item) => suma + (Number(item.peso_kg) || 0) * item.cantidad,
    0
  );
};