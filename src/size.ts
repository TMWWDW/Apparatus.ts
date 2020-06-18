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
  map(callbackfn: (point: number) => any): Size {
    return new Size({ width: callbackfn(this.width), height: callbackfn(this.height) });
  }

  static FromHTMLElement(element: HTMLElement): Size {
    let { width, height } = element.getBoundingClientRect();
    return new Size({ width, height });
  }

  static FromPair(width: number, height: number): Size {
    return new Size({ width, height });
  }

  static FromArray(array: [number, number] | number[]): Size {
    return new Size({ width: array[0], height: array[1] });
  }
}
