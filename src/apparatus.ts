import { Size, ISize } from "./size";
import { IVector, Vector } from "./vector";
import { Shape } from "./shape";
import { ApparatusObject } from "./object";

export type TShape =
  | Shape.Circle
  | Shape.CubicCurve
  | Shape.Free
  | Shape.Hexagon
  | Shape.Image
  | Shape.Line
  | Shape.Octagon
  | Shape.Pentagon
  | Shape.Polygon
  | Shape.QuadraticCurve
  | Shape.Rectangle
  | Shape.Text
  | Shape.Triangle;

export interface ISceneObject {
  component: ApparatusObject<TShape>;
  layer: number;
  visible: boolean;
}

export interface IScene extends Partial<ISize> {
  color?: string | CanvasPattern | CanvasGradient;
}

export default class Scene {
  context: CanvasRenderingContext2D;
  objects: ISceneObject[];
  color: string | CanvasPattern | CanvasGradient;

  layers: { minimum: number; maximum: number };

  constructor(public canvas: HTMLCanvasElement, options?: IScene) {
    if (!this.canvas) {
      throw new Error("Given source element is not present inside the current page.");
    }
    this.context = canvas.getContext("2d");
    this.canvas.width = options?.width || window.innerWidth;
    this.canvas.height = options?.height || window.innerHeight;
    this.color = options?.color || null;
    this.objects = [];
    this.layers = {
      minimum: 0,
      maximum: 0,
    };
  }

  get center(): Vector {
    return new Vector({ x: this.canvas.width / 2, y: this.canvas.height / 2 });
  }

  add(object: ApparatusObject<TShape>): void {
    this.objects.push({ component: object, layer: this.layers.maximum, visible: true });
    this.layers.maximum++;
  }
  remove(object: ApparatusObject<TShape>): void {
    let i = this.objects.indexOf(this.objects.find((o) => o.component === object));
    this.objects.splice(i, 1);
  }

  arrangeLayer(component: ApparatusObject<TShape>, layer: number): void {
    this.objects.find((o) => o.component === component).layer = layer;
    if (layer > this.layers.maximum) {
      this.layers.maximum = layer;
    } else if (layer < this.layers.minimum) {
      this.layers.minimum = layer;
    }
  }

  render(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.color) {
      this.context.save();
      this.context.fillStyle = this.color;
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.restore();
    }

    this.objects
      .sort((object, compare) => (object.layer < compare.layer ? -1 : 1))
      .forEach((object) => {
        if (object.visible) object.component.draw(this.context);
      });
  }

  loop(fps?: number): void {
    // TODO: Add fps to the calculation.
    let draw = () => {
      this.render();
      requestAnimationFrame(draw);
    };
    draw();
  }

  static GenerateCanvas(): HTMLCanvasElement {
    let canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    return canvas;
  }
}

export type TImage = HTMLImageElement | SVGImageElement | HTMLVideoElement | HTMLCanvasElement;
export type TArrangeMethod = "back" | "backwards" | "front" | "forwards";
export type TApparatusObjectEvent =
  | "bind"
  | "unbind"
  | "draw-start"
  | "draw-end"
  | "scale"
  | "rotate"
  | "set-anchor"
  | "arrange"
  | "set-visibility";

export interface IApparatusObjectEvent {
  name: TApparatusObjectEvent;
  callbackfn: Function;
}

export interface IBorder {
  segments?: number[];
  color?: string | CanvasPattern | CanvasGradient;
  width?: number;
  radius?: number;
}

export interface IShadow extends Partial<IVector> {
  blur?: number;
  color?: string;
}

export * from "./filter";
export * from "./color";
export * from "./vector";
export * from "./size";
export * from "./font";
export * from "./shape";
export * from "./object";
