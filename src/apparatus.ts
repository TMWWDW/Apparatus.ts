import { Size, ISize } from "./size";
import { Vector } from "./vector";
import { Shape } from "./shape";

export type TShape = Shape.Rectangle | Shape.Line | Shape.Text;

export default class Scene {
  context: CanvasRenderingContext2D;
  objects: Array<ApparatusObject<TShape>>;
  constructor(public canvas: HTMLCanvasElement, size?: ISize | Size) {
    this.context = canvas.getContext("2d");
    this.canvas.width = size?.width || window.innerWidth;
    this.canvas.height = size?.height || window.innerHeight;
    this.objects = [];
  }
  add(object: ApparatusObject<TShape>): void {
    this.objects.push(object);
  }
  remove(object: ApparatusObject<TShape>): void {
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
    scene.add((this as unknown) as ApparatusObject<TShape>);
    return (this as unknown) as T;
  }
}

export * from "./vector";
export * from "./size";
export * from "./font";
export * from "./shape";
