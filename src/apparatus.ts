import { Size, ISize } from "./size";
import { Vector, IVector } from "./vector";
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
      throw new Error("Given source element is not present inside the current page.");
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
          if (object.visible) object.component.draw(this.context);
        });

      requestAnimationFrame(draw);
    };

    draw();
  }
}

export type TImage = HTMLImageElement | SVGImageElement | HTMLVideoElement | HTMLCanvasElement;
export type TArrangeMethod = "back" | "backwards" | "front" | "forwards";

export interface IBorder {
  segments?: number[];
  color?: string | CanvasPattern | CanvasGradient;
  width?: number;
}

export interface IApparatusObject {
  color?: string | CanvasPattern | CanvasGradient;
  rotation?: number;
  opacity?: number;
  nofill?: boolean;
  border?: IBorder;
}

export class ApparatusObject<T> {
  position: Vector;
  anchor: Vector;
  color: string | CanvasPattern | CanvasGradient;
  rotation: number;
  owners: Scene[];
  opacity: number;
  nofill: boolean;
  border: IBorder;
  constructor() {
    this.rotation = 0;
    this.opacity = 1;
    this.color = "#222222";
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
  scale(_scale: number): T {
    console.warn(
      "It seems that this shape's scaling algorithm has not been implemented yet. This method will return the ApparatusObject<T> instance that the shape extends to."
    );
    return (this as unknown) as T;
  }
  rotate(angle: number): T {
    this.rotation = angle;
    return (this as unknown) as T;
  }
  setAnchor(_position: Vector | IVector): T {
    throw new Error("Method not implemented yet!");
    // return (this as unknown) as T;
  }
  setOpacity(opacity: number): T {
    this.opacity = opacity;
    return (this as unknown) as T;
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

  arrange(method: TArrangeMethod, scene?: Scene): T {
    let owner = scene ? this.owners.find((owner) => owner === scene) : this.owners[0];

    if (owner) {
      switch (method) {
        case "back":
          owner.arrangeLayer((this as unknown) as ApparatusObject<TShape>, owner.layer.minimum - 1);
          break;
        case "backwards":
          var instance = owner.objects.find(
            (object) => object.component === ((this as unknown) as ApparatusObject<TShape>)
          );
          owner.arrangeLayer((this as unknown) as ApparatusObject<TShape>, instance.layer - 1);
          break;
        case "front":
          owner.arrangeLayer((this as unknown) as ApparatusObject<TShape>, owner.layer.maximum + 1);

          break;
        case "forwards":
          var instance = owner.objects.find(
            (object) => object.component === ((this as unknown) as ApparatusObject<TShape>)
          );
          owner.arrangeLayer((this as unknown) as ApparatusObject<TShape>, instance.layer + 1);
          break;
      }
    } else {
      throw new Error(
        "Cannot find the specified scene or this shape has not been bound to any scene at all."
      );
    }
    return (this as unknown) as T;
  }

  setVisibility(visibility: boolean, scene?: Scene): T {
    let owner = scene ? this.owners.find((owner) => owner === scene) : this.owners[0];
    if (owner) {
      let instance = owner.objects.find(
        (object) => object.component === ((this as unknown) as ApparatusObject<TShape>)
      );
      instance.visible = visibility;
    } else {
      throw new Error(
        "Cannot find the specified scene or this shape has not been bound to any scene at all."
      );
    }
    return (this as unknown) as T;
  }
}

export * from "./color";
export * from "./vector";
export * from "./size";
export * from "./font";
export * from "./shape";
