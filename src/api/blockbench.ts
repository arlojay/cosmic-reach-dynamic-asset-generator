import { BlockModelFace } from "./blockModel";
import { Mod } from "./mod";
import { Texture } from "./texture";
import fs from "node:fs";

export interface SerializedBlockbenchFace {
    uv: [ number, number, number, number ];
    rotation?: 0 | 90 | 180 | 270;
    texture?: number;
}
export interface SerializedBlockbenchElement {
    from: [ number, number, number ];
    to: [ number, number, number ];
    autouv: number;
    inflate?: number;
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
export interface BlockbenchImportOptions {
    importTextures?: boolean;
}
export async function loadBlockbenchModel(mod: Mod, id: string, path: string, options?: BlockbenchImportOptions) {
    options ??= {};
    options.importTextures ??= true;

    const data: SerializedBlockbenchModel = JSON.parse(fs.readFileSync(path).toString());
    const blockModel = mod.createBlockModel(id);

    const textures: Map<number, Texture> = new Map;


    let textureIndex = 0;
    for await(const textureData of data.textures) {
        const fileName = textureData.name.split(".");
        const textureName = fileName.slice(0, -1).join(".");
        const texture = options.importTextures
            ? await Texture.loadFromFile(textureName, textureData.source)
            : new Texture(textureName, "base:textures/blocks/debug.png")
        textures.set(textureIndex++, texture);
    }

    for(const element of data.elements) {
        const cuboid = blockModel.createCuboid();
        const inflate = element.inflate ?? 0;
        cuboid.setSize(
            element.from[0], element.from[1], element.from[2],
            element.to[0], element.to[1], element.to[2],
        false);

        if(inflate != 0) cuboid.inflate = inflate;

        for(const faceId in element.faces) {
            const elementFace: SerializedBlockbenchFace = element.faces[faceId];
            const cuboidFace: BlockModelFace = cuboid[faceId];

            if(elementFace.rotation != null) cuboidFace.uvRotation = elementFace.rotation;
            if(elementFace.texture == null) {
                cuboidFace.texture = null;
            } else {
                cuboidFace.texture = textures.get(elementFace.texture);
            }

            cuboidFace.uvMin.set(elementFace.uv[0], elementFace.uv[1]);
            cuboidFace.uvMax.set(elementFace.uv[2], elementFace.uv[3]);
        }
        blockModel.addCuboid(cuboid);
    }

    return blockModel;
}