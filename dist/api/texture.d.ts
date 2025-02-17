import { Image } from "canvas";
import { Mod } from "./mod";
import { Identifier } from "./identifier";
export declare class Texture {
    id: string;
    texture: Image | string | Identifier;
    static loadFromFile(id: string, fullPath: string): Promise<Texture>;
    constructor(id: string, texture?: Image | string | Identifier);
    getAsBlockTexturePath(): string;
    getAsBlockTextureId(mod: Mod): Identifier;
    getAsItemTexturePath(): string;
    getAsItemTextureId(mod: Mod): Identifier;
    createTextureStream(): import("canvas").PNGStream;
}
