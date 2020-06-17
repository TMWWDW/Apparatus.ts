import { TImage } from "./apparatus";
import { Vector, IVector } from "./vector";
import { Size, ISize } from "./size";
import { Font, IFont } from "./font";
import { ApparatusObject, IApparatusObject } from "./object";
import { Color } from "./color";

export namespace Shape {
  export interface IImage extends IVector, ISize, IApparatusObject {
    image: TImage;
  }

  export class Image extends ApparatusObject<Image> {
    image: TImage;
    size: Size;
    source: { position: Vector; size: Size };
    private $clip: Image;
    constructor(options: IImage) {
      super(options);
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

      // if (this.clip) {
      //   this.$clip = new Image({
      //     x: this.clip.position.x - this.clip.size.width / 2,
      //     y: this.clip.position.y - this.clip.size.height / 2,
      //     width: this.clip.size.width,
      //     height: this.clip.size.height,
      //     ...this.clip,
      //   });
      // }
    }

    draw(context: CanvasRenderingContext2D): Image {
      context.translate(
        this.position.x + this.size.width / 2,
        this.position.y + this.size.height / 2
      );
      context.rotate((this.rotation * Math.PI) / 180);

      this.setContext(context);
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

      if (this.$clip) {
        // TO BE FIXED
        // context.rect(-this.size.width / 2, this.size.height / 2, this.size.width, this.size.height);
        // context.clip();
        // this.$clip.draw(context);
      }

      this.resetContext(context);

      context.rotate((-this.rotation * Math.PI) / 180);
      context.translate(
        -this.position.x - this.size.width / 2,
        -this.position.y - this.size.height / 2
      );

      return this;
    }

    setBackgroundSize(start: Vector | IVector, end: Vector | IVector): Image {
      this.source.position = start instanceof Vector ? start : new Vector(start);
      this.source.size = new Size({ width: end.x, height: end.y });
      return this;
    }

    scale(scale: number): Image {
      this.size.scale(scale);
      return this;
    }

    resize(size: Size | ISize): Image {
      this.size = size instanceof Size ? size : new Size(size);
      return this;
    }

    get center(): Vector {
      return new Vector({
        x: this.position.x + this.size.width / 2,
        y: this.position.y + this.size.height / 2,
      });
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
      super(options);
      this.position = new Vector(options);
      this.font = options.font instanceof Font ? options.font : new Font(options.font);
      this.stroked = options.stroked || false;
    }

    draw(context: CanvasRenderingContext2D): Text {
      this.setContext(context);

      if (this.stroked) {
        context.strokeText(this.content, this.position.x, this.position.y + this.font.size);
      } else {
        if (!this.nofill) {
          context.fillText(this.content, this.position.x, this.position.y + this.font.size);
        }
        if (this.border) {
          context.setLineDash(this.border.segments || []);
          context.strokeText(this.content, this.position.x, this.position.y + this.font.size);
        }
      }

      if (this.clip) {
        // TO BE FIXED
        // context.clip();
        // this.clip.draw(context);
      }

      this.resetContext(context);
      return this;
    }

    scale(scale: number): Text {
      this.font.setSize(this.font.size * scale);
      return this;
    }

    center(context: CanvasRenderingContext2D): Vector {
      console.warn("The center point calculation of this text is mostly an approximation.");
      let width = context.measureText(this.content).width;
      let height = context.measureText("M").width;
      return new Vector({ x: width / 2, y: height / 2 });
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
      super(options);
      this.position = options.start instanceof Vector ? options.start : new Vector(options.start);
      this.endposition = options.end instanceof Vector ? options.end : new Vector(options.end);
      this.length = this.position.distance(this.endposition);
    }
    draw(context: CanvasRenderingContext2D): Line {
      let center = this.center;
      this.setContext(context);

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

      this.resetContext(context);
      return this;
    }

    scale(): Line {
      console.warn("This object is not scalable.");
      return this;
    }

    get center(): Vector {
      return this.position.diffrence(this.endposition).divide(2).map(Math.abs);
    }
  }

  export class Triangle extends ApparatusObject<Triangle> {
    polygon: Polygon;
    constructor(options: Omit<IPolygon, "vertex">) {
      super(options);
      this.polygon = new Polygon({ ...options, vertex: 3 });
      this.position = this.polygon.position;
      this.rotation = this.polygon.rotation;
      this.color = this.polygon.color;
      this.opacity = this.polygon.opacity;
    }
    draw(context: CanvasRenderingContext2D): Triangle {
      this.polygon.draw(context);
      this.polygon.rotate(this.rotation);
      return this;
    }

    scale(scale: number): Triangle {
      this.polygon.radius *= scale;
      return this;
    }
  }

  export class Pentagon extends ApparatusObject<Pentagon> {
    polygon: Polygon;
    constructor(options: Omit<IPolygon, "vertex">) {
      super(options);
      this.polygon = new Polygon({ ...options, vertex: 5 });
      this.position = this.polygon.position;
      this.rotation = this.polygon.rotation;
      this.color = this.polygon.color;
      this.opacity = this.polygon.opacity;
    }
    draw(context: CanvasRenderingContext2D): Pentagon {
      this.polygon.draw(context);
      this.polygon.rotate(this.rotation);
      return this;
    }

    scale(scale: number): Pentagon {
      this.polygon.radius *= scale;
      return this;
    }
  }

  export class Hexagon extends ApparatusObject<Hexagon> {
    polygon: Polygon;
    constructor(options: Omit<IPolygon, "vertex">) {
      super(options);
      this.polygon = new Polygon({ ...options, vertex: 6 });
      this.position = this.polygon.position;
      this.rotation = this.polygon.rotation;
      this.color = this.polygon.color;
      this.opacity = this.polygon.opacity;
    }
    draw(context: CanvasRenderingContext2D): Hexagon {
      this.polygon.draw(context);
      this.polygon.rotate(this.rotation);
      return this;
    }
    scale(scale: number): Hexagon {
      this.polygon.radius *= scale;
      return this;
    }
  }

  export class Octagon extends ApparatusObject<Octagon> {
    polygon: Polygon;
    constructor(options: Omit<IPolygon, "vertex">) {
      super(options);
      this.polygon = new Polygon({ ...options, vertex: 8 });
      this.position = this.polygon.position;
      this.rotation = this.polygon.rotation;
      this.color = this.polygon.color;
      this.opacity = this.polygon.opacity;
    }
    draw(context: CanvasRenderingContext2D): Octagon {
      this.polygon.draw(context);
      this.polygon.rotate(this.rotation);
      return this;
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
      super(options);
      this.position = new Vector(options);
      this.radius = options.radius;
      this.stroked = options.stroked || false;
      this.vertex = options.vertex;
      if (options.color) this.color = options.color;
    }

    draw(context: CanvasRenderingContext2D): Polygon {
      this.setContext(context);

      context.translate(this.position.x, this.position.y)
      context.rotate((this.rotation * Math.PI) / 180);
      let v = this.getVertices().map(v => new Vector({ x: v.x - this.position.x, y: v.y - this.position.y }))
      ApparatusObject.DrawShape(context, this.border?.radius || 0, v);
      context.rotate((-this.rotation * Math.PI) / 180);
      context.translate(-this.position.x, -this.position.y)
      context.closePath()

      if (this.stroked) {
        context.stroke();
      } else {
        if (!this.nofill) {
          context.fill();
        }
        if (this.border?.width) {
          context.setLineDash(this.border.segments || []);
          context.stroke();
        }
      }
      if (this.clip) {
        context.clip();
        this.clip.draw(context);
      }

      this.resetContext(context);
      return this;
    }

    scale(scale: number): Polygon {
      this.radius *= scale;
      return this;
    }

    getVertices(): Vector[] {
      let result: Vector[] = [];
      for (let i = 0; i <= this.vertex; i++) {
        result.push(
          new Vector({
            x: this.radius * Math.cos((i * 2 * Math.PI) / this.vertex) + this.position.x,
            y: this.radius * Math.sin((i * 2 * Math.PI) / this.vertex) + this.position.y,
          })
        );
      }
      result.pop();
      return result;
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
      super(options);
      this.position = new Vector(options);
      this.radius = options.radius;
      this.stroked = options.stroked || false;
    }
    draw(context: CanvasRenderingContext2D): Circle {
      this.setContext(context);
      context.beginPath();

      context.translate(this.position.x, this.position.y);
      context.rotate((this.rotation * Math.PI) / 180);
      context.translate(-this.position.x, -this.position.y);
      context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);

      if (this.stroked) {
        context.stroke();
      } else {
        if (!this.nofill) {
          context.fill();
        }
        if (this.border) {
          context.setLineDash(this.border.segments || []);
          context.stroke();
        }
      }

      if (this.clip) {
        context.clip();
        this.clip.draw(context);
      }

      context.translate(this.position.x, this.position.y);
      context.rotate((-this.rotation * Math.PI) / 180);
      context.translate(-this.position.x, -this.position.y);

      this.resetContext(context);
      return this;
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
    private $clip: Image;
    constructor(options: IRectangle) {
      super(options);
      this.size = new Size(options);
      this.position = new Vector(options);
      this.stroked = options.stroked || false;

      if (this.clip) {
        this.$clip = new Image({
          x: this.clip.position.x - this.clip.size.width / 2,
          y: this.clip.position.y - this.clip.size.height / 2,
          width: this.clip.size.width,
          height: this.clip.size.height,
          ...this.clip,
        });
      }
    }
    draw(context: CanvasRenderingContext2D): Rectangle {
      context.translate(
        this.position.x + this.size.width / 2,
        this.position.y + this.size.height / 2
      );
      context.rotate((this.rotation * Math.PI) / 180);

      this.setContext(context);

      this.outline(context);
      if (this.stroked) {
        context.stroke();
      } else {
        if (!this.nofill) context.fill();
        if (this.border && this.border.width) {
          context.setLineDash(this.border.segments || []);
          context.stroke();
        }
      }

      if (this.$clip) {
        context.clip();
        this.$clip.draw(context);
      }

      this.resetContext(context);

      context.rotate((-this.rotation * Math.PI) / 180);
      context.translate(
        -this.position.x - this.size.width / 2,
        -this.position.y - this.size.height / 2
      );

      return this;
    }

    outline(context) {
      let radius = this.border?.radius || 0;
      let r = -this.size.width / 2 + this.size.width;
      let b = -this.size.height / 2 + this.size.height;

      context.beginPath();
      context.moveTo(-this.size.width / 2 + radius, -this.size.height / 2);
      context.lineTo(r - radius, -this.size.height / 2);
      context.quadraticCurveTo(r, -this.size.height / 2, r, -this.size.height / 2 + radius);
      context.lineTo(r, -this.size.height / 2 + this.size.height - radius);
      context.quadraticCurveTo(r, b, r - radius, b);
      context.lineTo(-this.size.width / 2 + radius, b);
      context.quadraticCurveTo(-this.size.width / 2, b, -this.size.width / 2, b - radius);
      context.lineTo(-this.size.width / 2, -this.size.height / 2 + radius);
      context.quadraticCurveTo(
        -this.size.width / 2,
        -this.size.height / 2,
        -this.size.width / 2 + radius,
        -this.size.height / 2
      );
    }

    // TO BE DONE
    // setAnchor(position: Vector | IVector): Rectangle {
    //   this.anchor = new Vector({
    //     x: position.x + this.position.x,
    //     y: position.y + this.position.y,
    //   });
    //   return this;
    // }

    scale(scale: number): Rectangle {
      this.size.scale(scale);
      return this;
    }

    resize(size: Size | ISize): Rectangle {
      this.size = size instanceof Size ? size : new Size(size);
      return this;
    }

    get center(): Vector {
      return new Vector({
        x: this.position.x + this.size.width / 2,
        y: this.position.y + this.size.height / 2,
      });
    }
  }

  export interface IFree extends IApparatusObject {
    vertices: IVector[];
    stroked?: boolean;
  }

  export class Free extends ApparatusObject<Free> {
    vertices: IVector[];
    stroked: boolean;
    constructor(options: IFree) {
      super(options);
      this.vertices = options.vertices;
      this.position = new Vector(this.vertices[0]);
      this.stroked = options.stroked || false;
      if (options.color) this.color = options.color;
    }
    draw(context: CanvasRenderingContext2D): Free {
      this.setContext(context);

      context.translate(this.vertices[0].x, this.vertices[0].y);
      context.rotate((this.rotation * Math.PI) / 180);
      context.translate(-this.vertices[0].x, -this.vertices[0].y);
      ApparatusObject.DrawShape(context, this.border?.radius || 0, this.vertices);
      context.translate(this.vertices[0].x, this.vertices[0].y);
      context.rotate((-this.rotation * Math.PI) / 180);
      context.translate(-this.vertices[0].x, -this.vertices[0].y);

      if (this.stroked) {
        context.stroke();
      } else {
        if (!this.nofill) context.fill();
        if (this.border && this.border.width) {
          context.setLineDash(this.border.segments || []);
          context.stroke();
        }
      }

      this.resetContext(context);
      return this;
    }
  }

  export interface ICubicCurve extends IApparatusObject, ILine {
    controls: [IVector | Vector, IVector | Vector];
  }

  export class CubicCurve extends ApparatusObject<CubicCurve> {
    controls: Vector[];
    endposition: Vector;
    constructor(options: ICubicCurve) {
      super(options);
      this.position = options.start instanceof Vector ? options.start : new Vector(options.start);
      this.endposition = options.end instanceof Vector ? options.end : new Vector(options.end);
      this.controls = options.controls.map((control) =>
        control instanceof Vector ? control : new Vector(control)
      );
    }

    draw(context: CanvasRenderingContext2D): CubicCurve {
      this.setContext(context);

      context.translate(this.position.x, this.position.y);
      context.rotate((this.rotation * Math.PI) / 180);

      context.moveTo(0, 0);
      context.bezierCurveTo(
        this.controls[0].x - this.position.x,
        this.controls[0].y - this.position.y,
        this.controls[1].x - this.position.x,
        this.controls[1].y - this.position.y,
        this.endposition.x - this.position.x,
        this.endposition.y - this.position.y
      );
      context.stroke();

      context.rotate((-this.rotation * Math.PI) / 180);
      context.translate(-this.position.x, -this.position.y);

      this.resetContext(context);
      return this;
    }
  }

  export interface IQuadraticCurve extends IApparatusObject, ILine {
    control: IVector | Vector
  }

  export class QuadraticCurve extends ApparatusObject<QuadraticCurve> {
    control: Vector;
    endposition: Vector;
    constructor(options: IQuadraticCurve) {
      super(options);
      this.position = options.start instanceof Vector ? options.start : new Vector(options.start);
      this.endposition = options.end instanceof Vector ? options.end : new Vector(options.end);
      this.control = options.control instanceof Vector ? options.control : new Vector(options.control)
    }

    draw(context: CanvasRenderingContext2D): QuadraticCurve {
      this.setContext(context);

      context.translate(this.position.x, this.position.y);
      context.rotate((this.rotation * Math.PI) / 180);

      context.moveTo(0, 0);
      context.quadraticCurveTo(
        this.control.x - this.position.x,
        this.control.y - this.position.y,
        this.endposition.x - this.position.x,
        this.endposition.y - this.position.y
      );
      context.stroke();

      context.rotate((-this.rotation * Math.PI) / 180);
      context.translate(-this.position.x, -this.position.y);

      this.resetContext(context);
      return this;
    }
  }
}
