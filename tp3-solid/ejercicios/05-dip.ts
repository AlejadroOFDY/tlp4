class EmailSender {
  send(to: string, message: string): void {
    console.log(`Correo para ${to}: ${message}`);
  }
}

interface Notifier {
  send(to: string, message: string): void;
}

class OrderService {
  private notifier: Notifier;

  constructor(notifier: Notifier) {
    this.notifier = notifier;
  }

  createOrder(customerEmail: string): void {
    console.log("Pedido creado");
    this.notifier.send(customerEmail, "Tu pedido fue creado");
  }
}

new OrderService(new EmailSender()).createOrder("ana@example.com");
