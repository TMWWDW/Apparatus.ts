import { ApparatusObject } from "./apparatus";
import { Vector, IVector } from "./vector";
import { Size, ISize } from "./size";
import { Font, IFont } from "./font";

export namespace Shape {
  export interface IText extends IVector {
    font: Font | IFont;
    stroked?: boolean;
    color?: string | CanvasPattern | CanvasGradient;
  }

  export class Text extends ApparatusObject<Text> {
    font: Font;
    stroked: boolean;
    constructor(public content: string, options: IText) {
      super();
      this.position = new Vector(options);
      this.font = options.font instanceof Font ? options.font : new Font(options.font);
      this.stroked = options.stroked || false;
      this.color = options.color || "#222222";
    }

    draw(context: CanvasRenderingContext2D): Text {
      let recordFont = context.font;
      context.font = this.font.create();

      if (this.stroked) {
        let recordStyle = context.strokeStyle;
        context.strokeStyle = this.color;
        context.strokeText(this.content, this.position.x, this.position.y + this.font.size);
        context.strokeStyle = recordStyle;
      } else {
        let recordStyle = context.fillStyle;
        context.fillStyle = this.color;
        context.fillText(this.content, this.position.x, this.position.y + this.font.size);
        context.fillStyle = recordStyle;
      }
      context.font = recordFont;

      return this;
    }
    getCenterPosition(context: CanvasRenderingContext2D): Vector {
      let width = context.measureText(this.content).width;
      let height = context.measureText("M").width;
      return new Vector({ x: width / 2, y: height / 2 });
    }
  }

  export interface ILine {
    start: Vector | IVector;
    end: Vector | IVector;
    color?: string | CanvasPattern | CanvasGradient;
    rotation?: number;
  }

  export class Line extends ApparatusObject<Line> {
    rotation: number;
    length: number;
    endposition: Vector;
    constructor(options: ILine) {
      super();
      this.position = options.start instanceof Vector ? options.start : new Vector(options.start);
      this.endposition = options.end instanceof Vector ? options.end : new Vector(options.end);
      this.rotation = options.rotation;
      this.length = this.position.distance(this.endposition);
      this.color = options.color || "#222222";
    }
    draw(context: CanvasRenderingContext2D): Line {
      let record = context.strokeStyle;
      let center = this.getCenterPosition();

      context.strokeStyle = this.color;

      context.beginPath();
      context.translate(center.x, center.y);
      context.rotate((this.rotation * Math.PI) / 180);
      context.translate(-center.x, -center.y);
      context.moveTo(this.position.x, this.position.y);
      context.lineTo(this.endposition.x, this.endposition.y);
      context.stroke();
      context.translate(center.x, center.y);
      context.rotate((-this.rotation * Math.PI) / 180);
      context.translate(-center.x, -center.y);

      context.strokeStyle = record;
      return this;
    }
    rotate(angle: number): Line {
      this.rotation = angle;
      return this;
    }
    getCenterPosition(_context?: CanvasRenderingContext2D): Vector {
      return this.position.diffrence(this.endposition).divide(2).map(Math.abs);
    }
  }

  export interface ITriangle {
    a: IVector;
    b: IVector;
    c: IVector;
    stroked?: boolean;
    color?: string | CanvasPattern | CanvasGradient;
    rotation?: number;
  }

  export class Triangle extends ApparatusObject<Triangle> {
    points: Vector[];
    stroked: boolean;
    rotation: number;
    constructor(options: ITriangle) {
      super();
      this.position = new Vector(options.a);
      this.points = [new Vector(options.a), new Vector(options.b), new Vector(options.c)];
      this.color = options.color || "#222222";
      this.stroked = options.stroked || false;
    }
    draw(context: CanvasRenderingContext2D): Triangle {
      let center = this.getCenterPosition();

      context.beginPath();
      context.translate(center.x, center.y);
      context.rotate((this.rotation * Math.PI) / 180);
      context.translate(-center.x, -center.y);
      context.moveTo(this.points[0].x, this.points[0].y);
      context.lineTo(this.points[1].x, this.points[1].y);
      context.lineTo(this.points[2].x, this.points[2].y);
      context.lineTo(this.points[0].x, this.points[0].y);
      context.translate(center.x, center.y);
      context.rotate((-this.rotation * Math.PI) / 180);
      context.translate(-center.x, -center.y);

      if (this.stroked) {
        let record = context.strokeStyle;
        context.strokeStyle = this.color;
        context.stroke();
        context.strokeStyle = record;
      } else {
        let record = context.fillStyle;
        context.fillStyle = this.color;
        context.fill();
        context.fillStyle = record;
      }
      return this;
    }
    rotate(angle: number): Triangle {
      this.rotation = angle;
      return this;
    }
    getCenterPosition(_context?: CanvasRenderingContext2D): Vector {
      let x = (this.points[0].x + this.points[1].x + this.points[2].x) / 3;
      let y = (this.points[0].y + this.points[1].y + this.points[2].y) / 3;
      return new Vector({ x, y });
    }
  }

  export interface ICircle extends IVector {
    radius: number;
    stroked?: boolean;
    color?: string | CanvasPattern | CanvasGradient;
  }

  export class Circle extends ApparatusObject<Circle> {
    radius: number;
    stroked: boolean;
    constructor(options: ICircle) {
      super();
      this.position = new Vector(options);
      this.radius = options.radius;
      this.color = options.color || "#222222";
      this.stroked = options.stroked || false;
    }
    draw(context: CanvasRenderingContext2D): Circle {
      // let record = context.fillStyle;
      context.fillStyle = this.color;
      context.beginPath();
      context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
      // this.stroked ? context.stroke() : context.fill();
      // context.fillStyle = record;

      if (this.stroked) {
        let record = context.strokeStyle;
        context.strokeStyle = this.color;
        context.stroke();
        context.strokeStyle = record;
      } else {
        let record = context.fillStyle;
        context.fillStyle = this.color;
        context.fill();
        context.fillStyle = record;
      }
      return this;
    }
    getCenterPosition(_context?: CanvasRenderingContext2D): Vector {
      return new Vector(this.position);
    }
  }

  export interface IRectangle extends ISize, IVector {
    color?: string | CanvasPattern | CanvasGradient;
    stroked?: boolean;
  }

  export class Rectangle extends ApparatusObject<Rectangle> {
    rotation: number;
    size: Size;
    stroked: boolean;
    constructor(options: IRectangle) {
      super();
      this.size = new Size(options);
      this.position = new Vector(options);
      this.color = options.color || "#222222";
      this.stroked = options.stroked || false;
      this.rotation = 0;
    }
    draw(context: CanvasRenderingContext2D): Rectangle {
      context.translate(
        this.position.x + this.size.width / 2,
        this.position.y + this.size.height / 2
      );

      context.rotate((this.rotation * Math.PI) / 180);

      if (this.stroked) {
        let record = context.strokeStyle;
        context.strokeStyle = this.color;
        context.strokeRect(
          -this.size.width / 2,
          -this.size.height / 2,
          this.size.width,
          this.size.height
        );
        context.strokeStyle = record;
      } else {
        let record = context.fillStyle;
        context.fillStyle = this.color;
        context.fillRect(
          -this.size.width / 2,
          -this.size.height / 2,
          this.size.width,
          this.size.height
        );
        context.fillStyle = record;
      }
      context.rotate((-this.rotation * Math.PI) / 180);

      context.translate(
        -this.position.x - this.size.width / 2,
        -this.position.y - this.size.height / 2
      );

      return this;
    }
    rotate(angle: number): Rectangle {
      this.rotation = angle;
      return this;
    }
    getCenterPosition(_context?: CanvasRenderingContext2D): Vector {
      return new Vector({
        x: this.position.x + this.size.width / 2,
        y: this.position.y + this.size.height / 2,
      });
    }
  }
}
