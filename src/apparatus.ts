import { Size, ISize } from "./size";
import { Vector } from "./vector";
import { Shape } from "./shape";

export type TShape =
  | Shape.Rectangle
  | Shape.Circle
  | Shape.Triangle
  | Shape.Pentagon
  | Shape.Hexagon
  | Shape.Octagon
  | Shape.Polygon
  | Shape.Line
  | Shape.Text;

export interface ISceneObject {
  component: ApparatusObject<TShape>;
  layer: number;
  visible: boolean;
}

export default class Scene {
  context: CanvasRenderingContext2D;
  objects: ISceneObject[];

  layer: { minimum: number; maximum: number };

  constructor(public canvas: HTMLCanvasElement, size?: ISize | Size) {
    if (!this.canvas) {
      console.error("Given source element is not present inside the current page.");
    }
    this.context = canvas.getContext("2d");
    this.canvas.width = size?.width || window.innerWidth;
    this.canvas.height = size?.height || window.innerHeight;
    this.objects = [];
    this.layer = {
      minimum: 0,
      maximum: 0,
    };
  }
  add(object: ApparatusObject<TShape>): void {
    this.objects.push({ component: object, layer: this.layer.maximum, visible: true });
    this.layer.maximum++;
  }
  remove(object: ApparatusObject<TShape>): void {
    let i = this.objects.indexOf(this.objects.find((o) => o.component === object));
    this.objects.splice(i, 1);
  }

  arrangeLayer(component: ApparatusObject<TShape>, layer: number): void {
    this.objects.find((o) => o.component === component).layer = layer;
    if (layer > this.layer.maximum) {
      this.layer.maximum = layer;
    } else if (layer < this.layer.minimum) {
      this.layer.minimum = layer;
    }
  }

  render(): void {
    let draw = () => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.objects
        .sort((object, compare) => (object.layer < compare.layer ? -1 : 1))
        .forEach((object) => {
          object.component.draw(this.context);
        });

      requestAnimationFrame(draw);
    };

    draw();
  }
}

export class ApparatusObject<T> {
  position: Vector;
  color: string | CanvasPattern | CanvasGradient;
  rotation: number;
  owners: Scene[];
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
  scale(scale: number): ApparatusObject<T> {
    console.warn(
      "It seems that this shape's scaling algorithm has not been implemented yet. This method will return an undefined equivalent of vector type. It is not recommended to be used."
    );
    return this;
  }
  rotate(angle: number): ApparatusObject<T> {
    this.rotation = angle;
    return this;
  }

  bind(scene: Scene): T {
    this.owners.push(scene);
    scene.add((this as unknown) as ApparatusObject<TShape>);
    return (this as unknown) as T;
  }
  unbind(scene: Scene): T {
    this.owners.splice(this.owners.indexOf(scene), 1);
    scene.remove((this as unknown) as ApparatusObject<TShape>);
    return (this as unknown) as T;
  }

  sentToBack(scene: Scene): T {
    let owner = this.owners.find((owner) => owner === scene);
    owner.arrangeLayer((this as unknown) as ApparatusObject<TShape>, owner.layer.minimum - 1);
    return (this as unknown) as T;
  }
  sendBackwards(scene: Scene): T {
    let owner = this.owners.find((owner) => owner === scene);
    let instance = owner.objects.find(
      (object) => object.component === ((this as unknown) as ApparatusObject<TShape>)
    );
    owner.arrangeLayer((this as unknown) as ApparatusObject<TShape>, instance.layer - 1);
    return (this as unknown) as T;
  }
  bringToFront(scene: Scene): T {
    let owner = this.owners.find((owner) => owner === scene);
    owner.arrangeLayer((this as unknown) as ApparatusObject<TShape>, owner.layer.maximum + 1);
    return (this as unknown) as T;
  }
  bringForwards(scene: Scene): T {
    let owner = this.owners.find((owner) => owner === scene);
    let instance = owner.objects.find(
      (object) => object.component === ((this as unknown) as ApparatusObject<TShape>)
    );
    owner.arrangeLayer((this as unknown) as ApparatusObject<TShape>, instance.layer + 1);
    return (this as unknown) as T;
  }
}

export * from "./color";
export * from "./vector";
export * from "./size";
export * from "./font";
export * from "./shape";
