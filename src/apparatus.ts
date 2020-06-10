export type Shape = Rectangle | Line;

export default class Scene {
  context: CanvasRenderingContext2D;
  objects: Array<ApparatusObject<Shape>>;
  constructor(public canvas: HTMLCanvasElement, size?: ISize | Size) {
    this.context = canvas.getContext("2d");
    this.canvas.width = size?.width || window.innerWidth;
    this.canvas.height = size?.height || window.innerHeight;
    this.objects = [];
  }
  add(object: ApparatusObject<Shape>): void {
    this.objects.push(object);
  }
  remove(object: ApparatusObject<Shape>): void {
    let i = this.objects.indexOf(object);
    this.objects.splice(i, 1);
  }

  setFillStyle(style: string | CanvasPattern | CanvasGradient): void {
    this.context.fillStyle = style;
  }

  render(): void {
    let draw = () => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.objects.forEach((o) => {
        o.draw(this.context);
      });

      requestAnimationFrame(draw);
    };

    draw();
  }
}

export class ApparatusObject<T> {
  position: Vector;
  color: string | CanvasPattern | CanvasGradient;
  constructor() {}
  draw(context: CanvasRenderingContext2D): T {
    return (this as unknown) as T;
  }
  add(scene: Scene): T {
    scene.add((this as unknown) as ApparatusObject<Shape>);
    return (this as unknown) as T;
  }
}

export interface IApparatusText extends IVector {
  font: Font | IFont;
  stroked?: boolean;
}

export class ApparatusText extends ApparatusObject<ApparatusText> {
  font: Font;
  stroked: boolean;
  constructor(public content: string, options: IApparatusText) {
    super();
    this.position = new Vector(options);
    this.font = options.font instanceof Font ? options.font : new Font(options.font);
    this.stroked = options.stroked || false;
  }
  draw(context: CanvasRenderingContext2D): ApparatusText {
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

export interface ISize {
  width: number;
  height: number;
}

export class Size {
  width: number;
  height: number;

  constructor(size: ISize) {
    this.width = size.width;
    this.height = size.height;
  }
  grow(size: Size | ISize): Size {
    this.width += size.width;
    this.height += size.height;
    return this;
  }
  shrink(size: Size | ISize): Size {
    this.width -= size.width;
    this.height -= size.height;
    return this;
  }
  scale(scale: number): Size {
    this.width *= scale;
    this.height *= scale;
    return this;
  }
  difference(size: Size | ISize): Size {
    return new Size({ width: this.width - size.width, height: this.height - this.height });
  }
}

export interface IFont {
  style?: CSSFontStyle;
  variant?: CSSFontVariant;
  weight?: CSSFontWeight;
  size: number;
  lineHeight?: CSSLineHeight;
  family?: CSSFontFamily;
}

export class Font {
  style: CSSFontStyle;
  variant: CSSFontVariant;
  weight: CSSFontWeight;
  size: number;
  lineHeight: CSSLineHeight;
  family: CSSFontFamily;
  constructor(font: IFont) {
    this.style = font.style || "normal";
    this.variant = font.variant || "normal";
    this.weight = font.weight || "normal";
    this.size = font.size;
    this.lineHeight = font.lineHeight || "normal";
    this.family = font.family || "Arial";
  }
  get Size(): string {
    return this.size.toString() + "px";
  }
  get LineHeight(): string {
    return this.lineHeight.toString() === "normal"
      ? this.lineHeight.toString()
      : this.lineHeight.toString() + "px";
  }
  create(): string {
    return `${this.style} ${this.variant} ${this.weight} ${this.Size}/${this.LineHeight} ${this.family}`;
  }
  increment(amount?: number): Font {
    this.size += amount || 1;
    return this;
  }
  decrement(amount?: number): Font {
    this.size -= amount || 1;
    return this;
  }
  setSize(size: number): Font {
    this.size = size;
    return this;
  }
}

type CSSFontStyle = "normal" | "italic" | "oblique" | "initial" | "inherit";
type CSSFontVariant = "normal" | "small-caps" | "initial" | "inherit";
type CSSFontWeight = "normal" | "bold" | "bolder" | "lighter" | "initial" | "inherit" | number;
type CSSLineHeight = "normal" | "length" | "initial" | "inherit" | number;
type CSSFontFamily = "initial" | "inherit" | string;
