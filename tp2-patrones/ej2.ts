abstract class Equipo {
  nombre: string;
  ram: string;
  procesador: string;

  constructor(nombre: string, ram: string, procesador: string) {
    this.nombre = nombre;
    this.ram = ram;
    this.procesador = procesador;
  }

  abstract detalles(): string;
}

class Notebook extends Equipo {
  detalles(): string {
    return `Tipo: Notebook, Nombre: ${this.nombre}, RAM: ${this.ram}, Procesador: ${this.procesador}`;
  }
}

class Desktop extends Equipo {
  detalles(): string {
    return `Tipo: Desktop, Nombre: ${this.nombre}, RAM: ${this.ram}, Procesador: ${this.procesador}`;
  }
}

class Servidor extends Equipo {
  detalles(): string {
    return `Tipo: Servidor, Nombre: ${this.nombre}, RAM: ${this.ram}, Procesador: ${this.procesador}`;
  }
}

class EquipoFactory {
  crearEquipo(
    tipo: string,
    nombre: string,
    ram: string,
    procesador: string,
  ): Equipo {
    if (tipo === "Notebook") {
      return new Notebook(nombre, ram, procesador);
    } else if (tipo === "Desktop") {
      return new Desktop(nombre, ram, procesador);
    } else if (tipo === "Servidor") {
      return new Servidor(nombre, ram, procesador);
    }
    throw new Error("Tipo de equipo no reconocido");
  }
}

const factory = new EquipoFactory();
const notebook = factory.crearEquipo("Notebook", "Dell XPS", "16GB", "i7");
console.log(notebook.detalles());

const servidor = factory.crearEquipo("Servidor", "Dell PowerEdge", "64GB", "Xeon");
console.log(servidor.detalles());
