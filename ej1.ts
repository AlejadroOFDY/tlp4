class Producto {
  nombre: string;
  precio: number;
  categoria: string;
  stock: number;

  constructor(
    nombre: string,
    precio: number,
    categoria: string,
    stock: number,
  ) {
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this.stock = stock;
  }

  describir(): string {
    return `${this.nombre} (${this.categoria}): $${this.precio} - ${this.stock} unidades`;
  }

  hayStock(cantidad: number): boolean {
    return cantidad > 0 && cantidad <= this.stock;
  }

  venderUnidades(cantidad: number): void {
    if (!this.hayStock(cantidad)) {
      throw new Error("La cantidad solicitada no esta disponible");
    }
    this.stock -= cantidad;
  }

  aplicarDescuento(porcentaje: number): number {
    if (porcentaje < 0 || porcentaje > 100) {
      throw new Error("El descuento debe estar entre 0 y 100");
    }
    return this.precio * (1 - porcentaje / 100);
  }
}

const mouse = new Producto("Mouse inalambrico", 18500, "informatica", 8);
console.log(mouse.describir());
console.log("Precio promocional:", mouse.aplicarDescuento(15));
mouse.venderUnidades(2);
console.log("Stock disponible:", mouse.stock);
