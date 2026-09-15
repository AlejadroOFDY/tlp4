// type PaymentType = "card" | "cash" | "transfer";

// class PaymentProcessor {
//   pay(type: PaymentType, amount: number): void {
//     switch (type) {
//       case "card":
//         console.log(`Pagando $${amount} con tarjeta`);
//         break;
//       case "cash":
//         console.log(`Pagando $${amount} en efectivo`);
//         break;
//       default:
//         throw new Error("Medio de pago no soportado");
//     }
//   }
// }

interface PaymentMethod {
  pay(amount: number): void;
}

class Card implements PaymentMethod {
  pay(amount: number): void {
    console.log(`Pagando $${amount} con tarjeta`);
  }
}

class Cash implements PaymentMethod {
  pay(amount: number): void {
    console.log(`Pagando $${amount} en efectivo`);
  }
}

class Transfer implements PaymentMethod {
  pay(amount: number): void {
    console.log(`Pagando $${amount} con transferencia`);
  }
}

class PaymentProcessor {
  pay(method: PaymentMethod, amount: number): void {
    method.pay(amount);
  }
}

const process = new PaymentProcessor();
process.pay(new Card(), 300);
process.pay(new Cash(), 500);
process.pay(new Transfer(), 800);
