import { ApparatusObject } from "./apparatus";
import { Vector, IVector } from "./vector";
import { Size, ISize } from "./size";
import { Font, IFont } from "./font";

export namespace Shape {
  export interface IText extends IVector {
    font: Font | IFont;
    stroked?: boolean;
  }

  export class Text extends ApparatusObject<Text> {
    font: Font;
    stroked: boolean;
    constructor(public content: string, options: IText) {
      super();
      this.position = new Vector(options);
      this.font = options.font instanceof Font ? options.font : new Font(options.font);
      this.stroked = options.stroked || false;
    }
    draw(context: CanvasRenderingContext2D): Text {
      let record = context.font;
      context.font = this.font.create();

      if (this.stroked) {
        context.strokeText(this.content, this.position.x, this.position.y + this.font.size);
      } else {
        context.fillText(this.content, this.position.x, this.position.y + this.font.size);
      }
      context.font = record;

      return this;
    }
  }

  export interface ILine {
    start: Vector | IVector;
    end: Vector | IVector;
    color?: string | CanvasPattern | CanvasGradient;
  }

  export class Line extends ApparatusObject<Line> {
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
      this.center = new Vector({
        x: this.position.x + this.size.width / 2,
        y: this.position.y + this.size.height / 2,
      });
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
