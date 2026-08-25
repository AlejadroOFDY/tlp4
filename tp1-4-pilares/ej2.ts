class CuentaBancaria {
  public readonly titular: string;
  private saldo: number;
  private movimientos: string[] = [];

  constructor(titular: string, saldoInicial: number) {
    if (saldoInicial < 0) {
      throw new Error("El saldo inicial no puede ser negativo");
    }
    this.titular = titular;
    this.saldo = saldoInicial;
    this.movimientos.push(`apertura: +${saldoInicial}`);
  }

  depositar(monto: number): void {
    this.validarMonto(monto);
    this.saldo += monto;
    this.movimientos.push(`deposito: +${monto}`);
  }

  retirar(monto: number): void {
    this.validarMonto(monto);
    if (monto > this.saldo) {
      throw new Error("Saldo insuficiente");
    }
    this.saldo -= monto;
    this.movimientos.push(`retiro: -${monto}`);
  }

  consultarSaldo(): number {
    return this.saldo;
  }

  obtenerHistorial(): string[] {
    return this.movimientos.map((movimiento) => movimiento);
  }

  private validarMonto(monto: number): void {
    if (monto <= 0) {
      throw new Error("El monto debe ser mayor que cero");
    }
  }
}

const cuenta = new CuentaBancaria("Sofia", 12000);
cuenta.depositar(2500);
cuenta.retirar(1800);
const copiaDelHistorial = cuenta.obtenerHistorial();
copiaDelHistorial.push("movimiento inventado");
console.log(cuenta.titular, cuenta.consultarSaldo());
console.log(cuenta.obtenerHistorial());
