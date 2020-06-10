export interface IVector {
  x: number;
  y: number;
}

export class Vector {
  x: number;
  y: number;

  constructor(vector: IVector) {
    this.x = vector.x;
    this.y = vector.y;
  }

  add(vector: Vector | IVector): Vector {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }
  subtract(vector: Vector | IVector): Vector {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }
  multiply(vector: Vector | IVector): Vector {
    this.x *= vector.x;
    this.y *= vector.y;
    return this;
  }
  divide(vector: Vector | IVector): Vector {
    this.x /= vector.x;
    this.y /= vector.y;
    return this;
  }
  diffrence(vector: Vector | IVector): Vector {
    return new Vector({
      x: this.x - vector.x,
      y: this.y - vector.y,
    });
  }
  distance(vector: Vector | IVector): number {
    let diff = this.diffrence(vector);
    diff.x = Math.abs(diff.x);
    diff.y = Math.abs(diff.y);
    diff.multiply({ x: diff.x, y: diff.y });
    return Math.sqrt(diff.x + diff.y);
  }
}
