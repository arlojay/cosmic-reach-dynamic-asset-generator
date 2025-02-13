import { Mod } from "./mod";
export interface SerializedBlockbenchFace {
    uv: [number, number, number, number];
    rotation?: 0 | 90 | 180 | 270;
    texture?: number;
}
export interface SerializedBlockbenchElement {
    from: [number, number, number];
    to: [number, number, number];
    autouv: number;
    faces: {
        north: SerializedBlockbenchFace;
        east: SerializedBlockbenchFace;
        south: SerializedBlockbenchFace;
        west: SerializedBlockbenchFace;
        up: SerializedBlockbenchFace;
        down: SerializedBlockbenchFace;
    };
}
export interface SerializedBlockbenchTexture {
    name: string;
    source: string;
}
export interface SerializedBlockbenchModel {
    elements: SerializedBlockbenchElement[];
    textures: SerializedBlockbenchTexture[];
}
export declare function loadBlockbenchModel(mod: Mod, id: string, path: string): Promise<import("./blockModel").BlockModel>;
