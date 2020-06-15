import { Size, ISize } from "./size";
import { IVector } from "./vector";
import { Shape } from "./shape";
import { ApparatusObject } from "./object";

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

export interface IShadow extends Partial<IVector> {
  blur?: number;
  color?: string;
}

export interface IApparatusObject {
  color?: string | CanvasPattern | CanvasGradient;
  rotation?: number;
  opacity?: number;
  nofill?: boolean;
  border?: IBorder;
  shadow?: IShadow;
}

export * from "./color";
export * from "./vector";
export * from "./size";
export * from "./font";
export * from "./shape";
