export interface IFont {
  style?: CSSFontStyle;
  variant?: CSSFontVariant;
  weight?: CSSFontWeight;
  size: number;
  lineHeight?: CSSLineHeight;
  family?: CSSFontFamily;
}

export class Font {
  style: CSSFontStyle;
  variant: CSSFontVariant;
  weight: CSSFontWeight;
  size: number;
  lineHeight: CSSLineHeight;
  family: CSSFontFamily;
  constructor(font: IFont) {
    this.style = font.style || "normal";
    this.variant = font.variant || "normal";
    this.weight = font.weight || "normal";
    this.size = font.size;
    this.lineHeight = font.lineHeight || "normal";
    this.family = font.family || "Arial";
  }
  get Size(): string {
    return this.size.toString() + "px";
  }
  get LineHeight(): string {
    return this.lineHeight.toString() === "normal"
      ? this.lineHeight.toString()
      : this.lineHeight.toString() + "px";
  }
  create(): string {
    return `${this.style} ${this.variant} ${this.weight} ${this.Size}/${this.LineHeight} ${this.family}`;
  }
  increment(amount?: number): Font {
    this.size += amount || 1;
    return this;
  }
  decrement(amount?: number): Font {
    this.size -= amount || 1;
    return this;
  }
  setSize(size: number): Font {
    this.size = size;
    return this;
  }

  static Helvetica = "helvetica";
  static Arial = "arial";
  static Gotham = "gotham";
  static Montserrat = "montserrat";
  static Quicksand = "quicksand";
  static Trajan = "trajan";
  static Garamond = "garamond";
  static Futura = "futura";
  static OpenSans = "open-sans";
}

export type CSSFontStyle = "normal" | "italic" | "oblique" | "initial" | "inherit";
export type CSSFontVariant = "normal" | "small-caps" | "initial" | "inherit";
export type CSSFontWeight =
  | "normal"
  | "bold"
  | "bolder"
  | "lighter"
  | "initial"
  | "inherit"
  | number;
export type CSSLineHeight = "normal" | "length" | "initial" | "inherit" | number;
export type CSSFontFamily = "initial" | "inherit" | string;
