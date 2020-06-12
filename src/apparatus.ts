import { Size, ISize } from "./size";
import { Vector } from "./vector";
import { Shape } from "./shape";

export type TShape =
  | Shape.Rectangle
  | Shape.Circle
  | Shape.Triangle
  | Shape.Pentagon
  | Shape.Line
  | Shape.Text;

export default class Scene {
  context: CanvasRenderingContext2D;
  objects: ApparatusObject<TShape>[];
  constructor(public canvas: HTMLCanvasElement, size?: ISize | Size) {
    if (!this.canvas) {
      console.error("Given source element is not present inside the current page.");
    }
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

  render(): void {
    let draw = () => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.objects
        // .sort((object, compare) => (object.layer < compare.layer ? -1 : 1))
        .forEach((object) => {
          object.draw(this.context);
        });

      requestAnimationFrame(draw);
    };

    draw();
  }
}

export interface IApparatusObjectOwner {
  scene: Scene;
  layer: number;
}

export class ApparatusObject<T> {
  position: Vector;
  color: string | CanvasPattern | CanvasGradient;
  rotation: number;
  owners: IApparatusObjectOwner[];
  constructor() {
    this.rotation = 0;
    this.owners = [];
  }
  draw(_context: CanvasRenderingContext2D): T {
    return (this as unknown) as T;
  }
  getCenterPosition(_context: CanvasRenderingContext2D): Vector {
    console.warn(
      "It seems that this shape's center position algorithm has not been implemented yet. This method will return an undefined equivalent of vector type. It is not recommended to be used."
    );
    return new Vector({ x: undefined, y: undefined });
  }
  rotate(angle: number): ApparatusObject<T> {
    this.rotation = angle;
    return this;
  }
  bind(scene: Scene): T {
    this.owners.push({ scene, layer: 0 });
    scene.add((this as unknown) as ApparatusObject<TShape>);
    return (this as unknown) as T;
  }
  unbind(scene: Scene): T {
    this.owners.splice(this.owners.indexOf(this.owners.find((owner) => owner.scene === scene)), 1);
    scene.remove((this as unknown) as ApparatusObject<TShape>);
    return (this as unknown) as T;
  }
}

export * from "./color";
export * from "./vector";
export * from "./size";
export * from "./font";
export * from "./shape";
