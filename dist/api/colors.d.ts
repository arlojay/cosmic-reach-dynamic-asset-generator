export declare class Color {
    name: string;
    r: number;
    g: number;
    b: number;
    constructor(name: string, r: number, g: number, b: number);
    toString(): string;
    get srgb(): {
        r: number;
        g: number;
        b: number;
    };
    get srgb255(): {
        r: number;
        g: number;
        b: number;
    };
}
export declare class ColorList {
    colors: Map<string, Color>;
    constructor(colors?: Color[] | null);
    [Symbol.iterator](): Generator<Color, void, unknown>;
    keys(): MapIterator<string>;
    values(): MapIterator<Color>;
    getColor(name: string): Color;
    getColorAtIndex(index: number): Color;
    addColor(...colors: Color[]): void;
}
export declare class Colors {
    static crColors: ColorList;
}
