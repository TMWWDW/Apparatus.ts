import { Vector, IVector } from "./vector";
import Scene, { IBorder, IShadow, TShape, TArrangeMethod } from "./apparatus";
import { Shape } from "./shape";

export interface IApparatusObject {
  color?: string | CanvasPattern | CanvasGradient;
  rotation?: number;
  opacity?: number;
  nofill?: boolean;
  border?: IBorder;
  shadow?: IShadow;
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
  shadow: IShadow;
  constructor() {
    this.color = "#222222";
    this.owners = [];
  }

  draw(_context: CanvasRenderingContext2D): T {
    return (this as unknown) as T;
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
	}

  protected setContext(context: CanvasRenderingContext2D): void {
    if (this.shadow) {
      context.shadowColor = this.shadow.color || "black";
      context.shadowBlur = this.shadow.blur || 1;
      context.shadowOffsetX = this.shadow.x || 1;
      context.shadowOffsetY = this.shadow.y || 1;
    }

    context.fillStyle = this.color;
    if (this.border?.color) context.strokeStyle = this.border.color;

    context.globalAlpha = this.opacity;
    context.lineWidth = this.border?.width || 1;

    if (this instanceof Shape.Text) {
      context.font = this.font.create();
    }
  }

  protected resetContext(context: CanvasRenderingContext2D): void {
    context.shadowColor = "black";
    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.fillStyle = "black";
    context.strokeStyle = "black";
    context.globalAlpha = 1;
    context.lineWidth = 1;
    context.font = "arial";
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
          owner.arrangeLayer((this as unknown) as ApparatusObject<TShape>, owner.layers.minimum - 1);
          break;
        case "backwards":
          var instance = owner.objects.find(
            (object) => object.component === ((this as unknown) as ApparatusObject<TShape>)
          );
          owner.arrangeLayer((this as unknown) as ApparatusObject<TShape>, instance.layer - 1);
          break;
        case "front":
          owner.arrangeLayer((this as unknown) as ApparatusObject<TShape>, owner.layers.maximum + 1);

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
