import { ApparatusObject, TImage, IApparatusObject } from "./apparatus";
import { Vector, IVector } from "./vector";
import { Size, ISize } from "./size";
import { Font, IFont } from "./font";

export namespace Shape {
  export interface IImage extends IVector, ISize, IApparatusObject {
    image: TImage;
  }

  export class Image extends ApparatusObject<Image> {
    image: TImage;
    size: Size;
    source: { position: Vector; size: Size };
    constructor(options: IImage) {
      super();
      this.image = options.image;
      this.position = new Vector(options);
      this.source = {
        position: new Vector({ x: 0, y: 0 }),
        size: new Size({
          width: this.image.width as number,
          height: this.image.height as number,
        }),
      };
      this.size = new Size(options);
      this.opacity = options.opacity;
    }

    draw(context: CanvasRenderingContext2D): Image {
      let recordOpacity = context.globalAlpha;

      context.globalAlpha = this.opacity;
      context.translate(
        this.position.x + this.size.width / 2,
        this.position.y + this.size.height / 2
      );
      context.rotate((this.rotation * Math.PI) / 180);
      context.drawImage(
        this.image,
        this.source.position.x,
        this.source.position.y,
        this.source.size.width,
        this.source.size.height,
        -this.size.width / 2,
        -this.size.height / 2,
        this.size.width,
        this.size.height
      );
      context.rotate((-this.rotation * Math.PI) / 180);

      context.translate(
        -this.position.x - this.size.width / 2,
        -this.position.y - this.size.height / 2
      );
      context.globalAlpha = recordOpacity;
      return this;
    }

    setBackgroundSize(start: Vector | IVector, end: Vector | IVector): Image {
      this.source.position = start instanceof Vector ? start : new Vector(start);
      this.source.size = new Size({ width: end.x, height: end.y });
      return this;
    }

    getCenterPosition(_context?: CanvasRenderingContext2D): Vector {
      return new Vector({
        x: this.position.x + this.size.width / 2,
        y: this.position.y + this.size.height / 2,
      });
    }

    scale(scale: number): Image {
      this.size.scale(scale);
      return this;
    }

    resize(size: Size | ISize): Image {
      this.size = size instanceof Size ? size : new Size(size);
      return this;
    }
  }

  export interface IText extends IVector, IApparatusObject {
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
      if (options.color) this.color = options.color;
    }

    draw(context: CanvasRenderingContext2D): Text {
      let recordFont = context.font;
      let recordOpacity = context.globalAlpha;
      context.font = this.font.create();
      context.globalAlpha = this.opacity;

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
      context.globalAlpha = recordOpacity;
      context.font = recordFont;

      return this;
    }
    getCenterPosition(context: CanvasRenderingContext2D): Vector {
      let width = context.measureText(this.content).width;
      let height = context.measureText("M").width;
      return new Vector({ x: width / 2, y: height / 2 });
    }

    scale(scale: number): Text {
      this.font.setSize(this.font.size * scale);
      return this;
    }
  }

  export interface ILine extends IApparatusObject {
    start: Vector | IVector;
    end: Vector | IVector;
  }

  export class Line extends ApparatusObject<Line> {
    length: number;
    endposition: Vector;
    constructor(options: ILine) {
      super();
      this.position = options.start instanceof Vector ? options.start : new Vector(options.start);
      this.endposition = options.end instanceof Vector ? options.end : new Vector(options.end);
      this.rotation = options.rotation;
      this.length = this.position.distance(this.endposition);
      if (options.color) this.color = options.color;
    }
    draw(context: CanvasRenderingContext2D): Line {
      let record = context.strokeStyle;
      let recordOpacity = context.globalAlpha;
      let center = this.getCenterPosition();

      context.strokeStyle = this.color;
      context.globalAlpha = this.opacity;

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

      context.globalAlpha = recordOpacity;
      context.strokeStyle = record;
      return this;
    }

    getCenterPosition(_context?: CanvasRenderingContext2D): Vector {
      return this.position.diffrence(this.endposition).divide(2).map(Math.abs);
    }

    scale(): Line {
      console.warn("This object is not scalable.");
      return this;
    }
  }

  export class Triangle extends ApparatusObject<Triangle> {
    polygon: Polygon;
    constructor(options: Omit<IPolygon, "vertex">) {
      super();
      this.polygon = new Polygon({ ...options, vertex: 3 });
      this.position = this.polygon.position;
      this.rotation = this.polygon.rotation;
      this.color = this.polygon.color;
      this.opacity = this.polygon.opacity;
    }
    draw(context: CanvasRenderingContext2D): Triangle {
      this.polygon.draw(context);
      this.polygon.rotate(30);
      return this;
    }

    getCenterPosition(_context?: CanvasRenderingContext2D): Vector {
      return this.position;
    }

    scale(scale: number): Triangle {
      this.polygon.radius *= scale;
      return this;
    }
  }

  export class Pentagon extends ApparatusObject<Pentagon> {
    polygon: Polygon;
    constructor(options: Omit<IPolygon, "vertex">) {
      super();
      this.polygon = new Polygon({ ...options, vertex: 5 });
      this.position = this.polygon.position;
      this.rotation = this.polygon.rotation;
      this.color = this.polygon.color;
      this.opacity = this.polygon.opacity;
    }
    draw(context: CanvasRenderingContext2D): Pentagon {
      this.polygon.draw(context);
      this.polygon.rotate(30);
      return this;
    }
    getCenterPosition(_context?: CanvasRenderingContext2D): Vector {
      return this.position;
    }

    scale(scale: number): Pentagon {
      this.polygon.radius *= scale;
      return this;
    }
  }

  export class Hexagon extends ApparatusObject<Hexagon> {
    polygon: Polygon;
    constructor(options: Omit<IPolygon, "vertex">) {
      super();
      this.polygon = new Polygon({ ...options, vertex: 6 });
      this.position = this.polygon.position;
      this.rotation = this.polygon.rotation;
      this.color = this.polygon.color;
      this.opacity = this.polygon.opacity;
    }
    draw(context: CanvasRenderingContext2D): Hexagon {
      this.polygon.draw(context);
      this.polygon.rotate(30);
      return this;
    }
    getCenterPosition(_context?: CanvasRenderingContext2D): Vector {
      return this.position;
    }

    scale(scale: number): Hexagon {
      this.polygon.radius *= scale;
      return this;
    }
  }

  export class Octagon extends ApparatusObject<Octagon> {
    polygon: Polygon;
    constructor(options: Omit<IPolygon, "vertex">) {
      super();
      this.polygon = new Polygon({ ...options, vertex: 8 });
      this.position = this.polygon.position;
      this.rotation = this.polygon.rotation;
      this.color = this.polygon.color;
      this.opacity = this.polygon.opacity;
    }
    draw(context: CanvasRenderingContext2D): Octagon {
      this.polygon.draw(context);
      this.polygon.rotate(30);
      return this;
    }
    getCenterPosition(_context?: CanvasRenderingContext2D): Vector {
      return this.position;
    }

    scale(scale: number): Octagon {
      this.polygon.radius *= scale;
      return this;
    }
  }

  export interface IPolygon extends IVector, IApparatusObject {
    radius: number;
    vertex: number;
    stroked?: boolean;
  }

  export class Polygon extends ApparatusObject<Polygon> {
    radius: number;
    stroked: boolean;
    vertex: number;
    constructor(options: IPolygon) {
      super();
      this.position = new Vector(options);
      this.radius = options.radius;
      this.rotation = options.rotation;
      if (options.color) this.color = options.color;
      this.stroked = options.stroked || false;
      this.vertex = options.vertex;
      this.opacity = options.opacity;
    }

    draw(context: CanvasRenderingContext2D): Polygon {
      let recordOpacity = context.globalAlpha;
      context.globalAlpha = this.opacity;

      context.beginPath();

      context.translate(this.position.x, this.position.y);
      context.rotate((this.rotation * Math.PI) / 180);

      context.moveTo(this.radius * Math.cos(0), this.radius * Math.sin(0));

      for (let i = 0; i <= this.vertex; i++) {
        context.lineTo(
          this.radius * Math.cos((i * 2 * Math.PI) / this.vertex),
          this.radius * Math.sin((i * 2 * Math.PI) / this.vertex)
        );
      }

      context.rotate((-this.rotation * Math.PI) / 180);
      context.translate(-this.position.x, -this.position.y);

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
      context.globalAlpha = recordOpacity;
      return this;
    }

    getCenterPosition(_context?: CanvasRenderingContext2D): Vector {
      return this.position;
    }

    scale(scale: number): Polygon {
      this.radius *= scale;
      return this;
    }
  }

  export interface ICircle extends IVector, IApparatusObject {
    radius: number;
    stroked?: boolean;
  }

  export class Circle extends ApparatusObject<Circle> {
    radius: number;
    stroked: boolean;
    constructor(options: ICircle) {
      super();
      this.position = new Vector(options);
      this.radius = options.radius;
      if (options.color) this.color = options.color;
      this.stroked = options.stroked || false;
    }
    draw(context: CanvasRenderingContext2D): Circle {
      let recordOpacity = context.globalAlpha;

      context.globalAlpha = this.opacity;
      context.beginPath();

      context.translate(this.position.x, this.position.y);
      context.rotate((this.rotation * Math.PI) / 180);
      context.translate(-this.position.x, -this.position.y);
      context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);

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
      context.translate(this.position.x, this.position.y);
      context.rotate((-this.rotation * Math.PI) / 180);
      context.translate(-this.position.x, -this.position.y);

      context.globalAlpha = recordOpacity;
      return this;
    }

    getCenterPosition(_context?: CanvasRenderingContext2D): Vector {
      return this.position;
    }

    scale(scale: number): Circle {
      this.radius *= scale;
      return this;
    }
  }

  export interface IRectangle extends ISize, IVector, IApparatusObject {
    stroked?: boolean;
  }

  export class Rectangle extends ApparatusObject<Rectangle> {
    size: Size;
    stroked: boolean;
    constructor(options: IRectangle) {
      super();
      this.size = new Size(options);
      this.position = new Vector(options);
      if (options.color) this.color = options.color;
      this.stroked = options.stroked || false;
    }
    draw(context: CanvasRenderingContext2D): Rectangle {
      let recordOpacity = context.globalAlpha;

      context.globalAlpha = this.opacity;

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
      context.globalAlpha = recordOpacity;

      return this;
    }
    getCenterPosition(_context?: CanvasRenderingContext2D): Vector {
      return new Vector({
        x: this.position.x + this.size.width / 2,
        y: this.position.y + this.size.height / 2,
      });
    }

    scale(scale: number): Rectangle {
      this.size.scale(scale);
      return this;
    }

    resize(size: Size | ISize): Rectangle {
      this.size = size instanceof Size ? size : new Size(size);
      return this;
    }
  }
}
