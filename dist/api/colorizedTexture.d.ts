import { Canvas, Image } from "canvas";
import { Texture } from "./texture";
export declare class ColorizedTexture {
    whiteTexture: Canvas;
    blackTexture: Canvas;
    static createFromFiles(whiteSource: string, blackSource: string): Promise<ColorizedTexture>;
    constructor(whiteTexture: Image, blackTexture: Image);
    private static imageToCanvas;
    createTexture(name: string, r: number, g: number, b: number, a?: number): Promise<Texture>;
}
