import { Vector, IVector } from "./vector";
import Scene, { IBorder, IShadow, TShape, TArrangeMethod, TImage, Filter } from "./apparatus";
import { Shape } from "./shape";

export interface IApparatusObject {
  color?: string | CanvasPattern | CanvasGradient;
  rotation?: number;
  opacity?: number;
  nofill?: boolean;
  border?: IBorder;
  shadow?: IShadow;
  clip?: Shape.Image;
  filter?: Filter;
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
  clip: Shape.Image;
  filter?: Filter;
  constructor(options?: IApparatusObject) {
    this.color = options?.color || "#222222";
    this.rotation = options?.rotation || 0;
    this.opacity = options?.opacity || 1;
    this.nofill = options?.nofill || false;
    this.border = options?.border || null;
    this.shadow = options?.shadow || null;
    this.clip = options?.clip || null;
    this.filter = options?.filter || null;
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
    context.save();
    context.beginPath();
    if (this.shadow) {
      context.shadowColor = this.shadow.color || "black";
      context.shadowBlur = this.shadow.blur || 1;
      context.shadowOffsetX = this.shadow.x || 1;
      context.shadowOffsetY = this.shadow.y || 1;
    }

    if (this.filter) context.filter = this.filter.bundle();

    context.fillStyle = this.color;
    if (this.border?.color) context.strokeStyle = this.border.color;

    context.globalAlpha = this.opacity;
    context.lineWidth = this.border?.width || 1;

    if (this instanceof Shape.Text) {
      context.font = this.font.bundle();
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
    context.closePath();
    context.restore();
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
          owner.arrangeLayer(
            (this as unknown) as ApparatusObject<TShape>,
            owner.layers.minimum - 1
          );
          break;
        case "backwards":
          var instance = owner.objects.find(
            (object) => object.component === ((this as unknown) as ApparatusObject<TShape>)
          );
          owner.arrangeLayer((this as unknown) as ApparatusObject<TShape>, instance.layer - 1);
          break;
        case "front":
          owner.arrangeLayer(
            (this as unknown) as ApparatusObject<TShape>,
            owner.layers.maximum + 1
          );

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

  static DrawShape(
    context: CanvasRenderingContext2D,
    radius: number,
    points: Array<Vector | IVector>
  ) {
    // Not gonna lie, this part is not mine.
    let i,
      x,
      y,
      len,
      p1,
      p2,
      p3,
      v1,
      v2,
      sinA,
      sinA90,
      radDirection,
      drawDirection,
      angle,
      halfAngle,
      cRadius,
      lenOut;
    let asVec = function (p, pp, v) {
      v.x = pp.x - p.x;
      v.y = pp.y - p.y;
      v.len = Math.sqrt(v.x * v.x + v.y * v.y);
      v.nx = v.x / v.len;
      v.ny = v.y / v.len;
      v.ang = Math.atan2(v.ny, v.nx);
    };
    v1 = {};
    v2 = {};
    len = points.length;
    p1 = points[len - 1];
    for (i = 0; i < len; i++) {
      p2 = points[i % len];
      p3 = points[(i + 1) % len];
      asVec(p2, p1, v1);
      asVec(p2, p3, v2);
      sinA = v1.nx * v2.ny - v1.ny * v2.nx;
      sinA90 = v1.nx * v2.nx - v1.ny * -v2.ny;
      angle = Math.asin(sinA);
      radDirection = 1;
      drawDirection = false;
      if (sinA90 < 0) {
        if (angle < 0) {
          angle = Math.PI + angle;
        } else {
          angle = Math.PI - angle;
          radDirection = -1;
          drawDirection = true;
        }
      } else {
        if (angle > 0) {
          radDirection = -1;
          drawDirection = true;
        }
      }
      halfAngle = angle / 2;
      lenOut = Math.abs((Math.cos(halfAngle) * radius) / Math.sin(halfAngle));
      if (lenOut > Math.min(v1.len / 2, v2.len / 2)) {
        lenOut = Math.min(v1.len / 2, v2.len / 2);
        cRadius = Math.abs((lenOut * Math.sin(halfAngle)) / Math.cos(halfAngle));
      } else {
        cRadius = radius;
      }
      x = p2.x + v2.nx * lenOut;
      y = p2.y + v2.ny * lenOut;
      x += -v2.ny * cRadius * radDirection;
      y += v2.nx * cRadius * radDirection;
      context.arc(
        x,
        y,
        cRadius,
        v1.ang + (Math.PI / 2) * radDirection,
        v2.ang - (Math.PI / 2) * radDirection,
        drawDirection
      );
      p1 = p2;
      p2 = p3;
    }
  }
}
