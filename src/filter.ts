export class Filter {
  filters: string[];
  constructor() {
    this.filters = [];
  }

  blur(pixel: number): Filter {
    this.filters.push(`blur(${pixel}px)`);
    return this;
  }

  brightness(percent: number): Filter {
    this.filters.push(`brightness(${percent}%)`);
    return this;
  }

  contrast(percent: number): Filter {
    this.filters.push(`contrast(${percent}%)`);
    return this;
  }

  grayscale(percent: number): Filter {
    this.filters.push(`grayscale(${percent}%)`);
    return this;
  }

  hueRotate(angle: number): Filter {
    this.filters.push(`hue-rotate(${angle}deg)`);
    return this;
  }

  invert(percent: number): Filter {
    this.filters.push(`invert(${percent}%)`);
    return this;
  }

  saturate(percent: number): Filter {
    this.filters.push(`saturate(${percent}%)`);
    return this;
  }

  sepia(percent: number): Filter {
    this.filters.push(`sepia(${percent}%)`);
    return this;
  }

  bundle(): string {
    return this.filters.join(" ");
  }
}
