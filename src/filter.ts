export class Filter {
  filters: string[];
  constructor() {
    this.filters = [];
  }

  blur(pixel: number): Filter {
    this.filters.push(`blur(${pixel}px)`);
    return this;
  }

  bundle(): string {
    return this.filters.join(" ");
  }
}
