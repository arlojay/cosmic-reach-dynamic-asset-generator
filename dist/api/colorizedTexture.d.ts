import { Canvas, Image } from "canvas";
import { Texture } from "./texture";
export declare enum ColorizedTextureMethod {
    MIX = 0,
    SOFT_LIGHT = 1
}
export declare class ColorizedTexture {
    whiteTexture: Canvas;
    blackTexture: Canvas;
    colorMethod: ColorizedTextureMethod;
    static createFromFiles(whiteSource: string, blackSource: string): Promise<ColorizedTexture>;
    private static imageToCanvas;
    constructor(whiteTexture: Image, blackTexture: Image);
    setColorMethod(newMethod: ColorizedTextureMethod): void;
    private composite;
    createTexture(name: string, r: number, g: number, b: number, a?: number): Promise<Texture>;
}
