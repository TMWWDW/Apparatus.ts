import { Vector, IVector } from "./vector";

export interface GradientStop {
  offset: number;
  color: string;
}

export class Color {
  static Hex(color: number): string {
    return `#${color.toString(16)}`;
  }

  static RGB(red: number, green: number = red, blue: number = red): string {
    return `rgb(${red}, ${green} ,${blue})`;
  }

  static RGBA(red: number, green: number, blue: number, alpha: number): string {
    return `rgba(${red}, ${green} ,${blue}, ${alpha})`;
  }

  static LinearGradient(
    context: CanvasRenderingContext2D,
    from: Vector | IVector,
    to: Vector | IVector,
    stops: GradientStop[]
  ): CanvasGradient {
    let gradient = context.createLinearGradient(from.x, from.y, to.x, to.y);

    stops.forEach((stop) => {
      gradient.addColorStop(stop.offset, stop.color);
    });

    return gradient;
  }

  static RadialGradient(
    context: CanvasRenderingContext2D,
    start: Vector | IVector,
    end: Vector | IVector,
    radii: [number, number],
    stops: GradientStop[]
  ): CanvasGradient {
    let gradient = context.createRadialGradient(start.x, start.y, radii[0], end.x, end.y, radii[1]);

    stops.forEach((stop) => {
      gradient.addColorStop(stop.offset, stop.color);
    });

    return gradient;
  }

  static Red = "red";
  static Green = "green";
  static Blue = "blue";
  static White = "white";
  static Black = "black";

  static Lightsalmon = "lightsalmon";
  static Salmon = "salmon";
  static Darksalmon = "darksalmon";
  static Lightcoral = "lightcoral";
  static Indianred = "indianred";
  static Crimson = "crimson";
  static Firebrick = "firebrick";
  static Darkred = "darkred";
  static Coral = "coral";
  static Tomato = "tomato";
  static Orangered = "orangered";
  static Gold = "gold";
  static Orange = "orange";
  static Darkorange = "darkorange";
  static Lightyellow = "lightyellow";
  static Lemonchiffon = "lemonchiffon";
  static Lightgoldenrodyellow = "lightgoldenrodyellow";
  static Papayawhip = "papayawhip";
  static Moccasin = "moccasin";
  static Peachpuff = "peachpuff";
  static Palegoldenrod = "palegoldenrod";
  static Khaki = "khaki";
  static Darkkhaki = "darkkhaki";
  static Yellow = "yellow";
  static Lawngreen = "lawngreen";
  static Chartreuse = "chartreuse";
  static Limegreen = "limegreen";
  static Lime = "lime";
  static Forestgreen = "forestgreen";
  static Darkgreen = "darkgreen";
  static Greenyellow = "greenyellow";
  static Yellowgreen = "yellowgreen";
  static Springgreen = "springgreen";
  static Mediumspringgreen = "mediumspringgreen";
  static Lightgreen = "lightgreen";
  static Palegreen = "palegreen";
  static Darkseagreen = "darkseagreen";
  static Mediumseagreen = "mediumseagreen";
  static Seagreen = "seagreen";
  static Olive = "olive";
  static Darkolivegreen = "darkolivegreen";
  static Olivedrab = "olivedrab";
  static Lightcyan = "lightcyan";
  static Cyan = "cyan";
  static Aqua = "aqua";
  static Aquamarine = "aquamarine";
  static Mediumaquamarine = "mediumaquamarine";
  static Paleturquoise = "paleturquoise";
  static Turquoise = "turquoise";
  static Mediumturquoise = "mediumturquoise";
  static Darkturquoise = "darkturquoise";
  static Lightseagreen = "lightseagreen";
  static Cadetblue = "cadetblue";
  static Darkcyan = "darkcyan";
  static Teal = "teal";
  static Powderblue = "powderblue";
  static Lightblue = "lightblue";
  static Lightskyblue = "lightskyblue";
  static Skyblue = "skyblue";
  static Deepskyblue = "deepskyblue";
  static Lightsteelblue = "lightsteelblue";
  static Dodgerblue = "dodgerblue";
  static Cornflowerblue = "cornflowerblue";
  static Steelblue = "steelblue";
  static Royalblue = "royalblue";
  static Mediumblue = "mediumblue";
  static Darkblue = "darkblue";
  static Navy = "navy";
  static Midnightblue = "midnightblue";
  static Mediumslateblue = "mediumslateblue";
  static Slateblue = "slateblue";
  static Darkslateblue = "darkslateblue";
  static Lavender = "lavender";
  static Thistle = "thistle";
  static Plum = "plum";
  static Violet = "violet";
  static Orchid = "orchid";
  static Fuchsia = "fuchsia";
  static Magenta = "magenta";
  static Mediumorchid = "mediumorchid";
  static Mediumpurple = "mediumpurple";
  static Blueviolet = "blueviolet";
  static Darkviolet = "darkviolet";
  static Darkorchid = "darkorchid";
  static Darkmagenta = "darkmagenta";
  static Purple = "purple";
  static Indigo = "indigo";
  static Pink = "pink";
  static Lightpink = "lightpink";
  static Hotpink = "hotpink";
  static Deeppink = "deeppink";
  static Palevioletred = "palevioletred";
  static Mediumvioletred = "mediumvioletred";
  static Snow = "snow";
  static Honeydew = "honeydew";
  static Mintcream = "mintcream";
  static Azure = "azure";
  static Aliceblue = "aliceblue";
  static Ghostwhite = "ghostwhite";
  static Whitesmoke = "whitesmoke";
  static Seashell = "seashell";
  static Beige = "beige";
  static Oldlace = "oldlace";
  static Floralwhite = "floralwhite";
  static Ivory = "ivory";
  static Antiquewhite = "antiquewhite";
  static Linen = "linen";
  static Lavenderblush = "lavenderblush";
  static Mistyrose = "mistyrose";
  static Gainsboro = "gainsboro";
  static Lightgray = "lightgray";
  static Silver = "silver";
  static Darkgray = "darkgray";
  static Gray = "gray";
  static Dimgray = "dimgray";
  static Lightslategray = "lightslategray";
  static Slategray = "slategray";
  static Darkslategray = "darkslategray";
  static Cornsilk = "cornsilk";
  static Blanchedalmond = "blanchedalmond";
  static Bisque = "bisque";
  static Navajowhite = "navajowhite";
  static Wheat = "wheat";
  static Burlywood = "burlywood";
  static Tan = "tan";
  static Rosybrown = "rosybrown";
  static Sandybrown = "sandybrown";
  static Goldenrod = "goldenrod";
  static Peru = "peru";
  static Chocolate = "chocolate";
  static Saddlebrown = "saddlebrown";
  static Sienna = "sienna";
  static Brown = "brown";
  static Maroon = "maroon";
}
