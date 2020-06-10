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
    center: Vector;
    constructor(public content: string, options: IText) {
      super();
      this.position = new Vector(options);
      this.font = options.font instanceof Font ? options.font : new Font(options.font);
      this.stroked = options.stroked || false;
      this.color = options.color || "#222222";

      // let width = context.measureText(this.content).width;
      // let height = context.measureText("M").width;
      // this.center = new Vector({ x: width / 2, y: height / 2 });
    }

    draw(context: CanvasRenderingContext2D): Text {
      let recordFont = context.font;
      let recordStyle = context.fillStyle;
      context.font = this.font.create();
      context.fillStyle = this.color;

      if (this.stroked) {
        context.strokeText(this.content, this.position.x, this.position.y + this.font.size);
      } else {
        context.fillText(this.content, this.position.x, this.position.y + this.font.size);
      }
      context.fillStyle = recordStyle;
      context.font = recordFont;

      return this;
    }
  }

  export interface ILine {
    start: Vector | IVector;
    end: Vector | IVector;
    color?: string | CanvasPattern | CanvasGradient;
  }

  export class Line extends ApparatusObject<Line> {
    // TODO: ADD CENTER POINT
    rotation: number;
    length: number;
    endposition: Vector;
    constructor(options: ILine) {
      super();
      this.position = options.start instanceof Vector ? options.start : new Vector(options.start);
      this.endposition = options.end instanceof Vector ? options.end : new Vector(options.end);
      this.length = this.position.distance(this.endposition);
      this.color = options.color || "#222222";
    }
    draw(context: CanvasRenderingContext2D): Line {
      let record = context.strokeStyle;
      context.strokeStyle = this.color;
      context.rotate((this.rotation * Math.PI) / 180);
      context.beginPath();
      context.moveTo(this.position.x, this.position.y);
      context.lineTo(this.endposition.x, this.endposition.y);
      context.stroke();
      context.rotate((-this.rotation * Math.PI) / 180);
      context.strokeStyle = record;
      return this;
    }
    rotate(angle: number): Line {
      this.rotation = angle;
      return this;
    }
  }

  export interface ICircle extends IVector {
    radius: number;
    stroked?: boolean;
    color?: string | CanvasPattern | CanvasGradient;
  }

  export class Circle extends ApparatusObject<Circle> {
    radius: number;
    center: Vector;
    stroked: boolean;
    constructor(options: ICircle) {
      super();
      this.position = new Vector(options);
      this.radius = options.radius;
      this.color = options.color || "#222222";
      this.stroked = options.stroked || false;
    }
    draw(context: CanvasRenderingContext2D): Circle {
      let record = context.fillStyle;
      context.fillStyle = this.color;
      context.beginPath();
      context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
      this.stroked ? context.stroke() : context.fill();
      context.fillStyle = record;
      return this;
    }
    getCenterPosition(_context?: CanvasRenderingContext2D): Vector {
      return new Vector(this.position);
    }
  }

  export interface IRectangle extends ISize, IVector {
    color?: string | CanvasPattern | CanvasGradient;
  }

  export class Rectangle extends ApparatusObject<Rectangle> {
    rotation: number;
    center: Vector;
    size: Size;
    constructor(options: IRectangle) {
      super();
      this.size = new Size(options);
      this.position = new Vector(options);
      this.color = options.color || "#222222";
      this.rotation = 0;
      // this.center = new Vector({
      //   x: this.position.x + this.size.width / 2,
      //   y: this.position.y + this.size.height / 2,
      // });
    }
    draw(context: CanvasRenderingContext2D): Rectangle {
      let record = context.fillStyle;

      context.translate(
        this.position.x + this.size.width / 2,
        this.position.y + this.size.height / 2
      );

      context.rotate((this.rotation * Math.PI) / 180);
      context.fillStyle = this.color;
      context.fillRect(
        -this.size.width / 2,
        -this.size.height / 2,
        this.size.width,
        this.size.height
      );
      context.fillStyle = record;
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
  }
}
