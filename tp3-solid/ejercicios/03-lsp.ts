interface Shape {
  area(): number;
}

class Rectangle implements Shape {
  protected width: number;
  protected height: number;

  constructor(
    width: number,
    height: number,
  ) {
    this.width = width;
    this.height = height;
  }

  setWidth(width: number): void {
    this.width = width;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  area(): number {
    return this.width * this.height;
  }
}

function resizeRectangle(rectangle: Rectangle): void {
  rectangle.setWidth(5);
  rectangle.setHeight(10);
  console.log(`Area esperada: 50. Area obtenida: ${rectangle.area()}`);
}

resizeRectangle(new Rectangle(1, 1));
 
class Square implements Shape {
  private side: number;

  constructor(side: number) {
    this.side = side;
  }

  area(): number {
    return this.side * this.side;
  }
}

console.log(`Area del cuadrado: ${new Square(4).area()}`);
