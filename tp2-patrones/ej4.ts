interface Equipo {
  nombre: string;
  tipo: string;
  estado: string;
}

class InventarioViejo {
  private items: Equipo[] = [];

  agregarItem(nombre: string, tipo: string, estado: string): void {
    this.items.push({ nombre, tipo, estado });
  }

  obtenerItems(): Equipo[] {
    return this.items;
  }
}

interface Inventario {
  agregarEquipo(nombre: string, tipo: string, estado: string): void;
  listarEquipos(): Equipo[];
}

class AdaptadorInventario implements Inventario {
  private inventarioViejo: InventarioViejo;

  constructor(inventarioViejo: InventarioViejo) {
    this.inventarioViejo = inventarioViejo;
  }

  agregarEquipo(nombre: string, tipo: string, estado: string): void {
    this.inventarioViejo.agregarItem(nombre, tipo, estado);
  }

  listarEquipos(): Equipo[] {
    return this.inventarioViejo.obtenerItems();
  }
}

const inventarioViejo = new InventarioViejo();
const adaptador = new AdaptadorInventario(inventarioViejo);
adaptador.agregarEquipo("Servidor Dell", "Servidor", "disponible");
console.log(adaptador.listarEquipos());
