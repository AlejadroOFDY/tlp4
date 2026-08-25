interface Equipo {
  nombre: string;
  tipo: string;
  estado: string;
}

class Inventario {
  private static instancia: Inventario;
  private equipo: Equipo[] = [];

  private constructor() {}

  public static obtenerInventario(): Inventario {
    if (!Inventario.instancia) {
      Inventario.instancia = new Inventario();
    }
    return Inventario.instancia;
  }

  public agregarEquipo(nombre: string, tipo: string, estado: string): void {
    this.equipo.push({ nombre, tipo, estado });
  }

  public listarEquipos() {
    return this.equipo;
  }
}

const inventario = Inventario.obtenerInventario();

inventario.agregarEquipo("Notebook HP", "Portátil", "disponible");
console.log(inventario.listarEquipos());
