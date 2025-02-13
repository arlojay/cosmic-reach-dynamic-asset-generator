"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadBlockbenchModel = loadBlockbenchModel;
const texture_1 = require("./texture");
const node_fs_1 = __importDefault(require("node:fs"));
async function loadBlockbenchModel(mod, id, path) {
    const data = JSON.parse(node_fs_1.default.readFileSync(path).toString());
    const blockModel = mod.createBlockModel(id);
    const textures = new Map;
    let textureIndex = 0;
    for await (const textureData of data.textures) {
        const fileName = textureData.name.split(".");
        const texture = await texture_1.Texture.loadFromFile(fileName.slice(0, -1).join("."), textureData.source);
        textures.set(textureIndex++, texture);
    }
    for (const element of data.elements) {
        const cuboid = blockModel.createCuboid();
        cuboid.setSize(...element.from, ...element.to, false);
        for (const faceId in element.faces) {
            const elementFace = element.faces[faceId];
            const cuboidFace = cuboid[faceId];
            if (elementFace.rotation != null)
                cuboidFace.uvRotation = elementFace.rotation;
            if (elementFace.texture == null) {
                cuboidFace.texture = null;
            }
            else {
                cuboidFace.texture = textures.get(elementFace.texture);
            }
            cuboidFace.uvMin.set(elementFace.uv[0], elementFace.uv[1]);
            cuboidFace.uvMax.set(elementFace.uv[2], elementFace.uv[3]);
        }
        blockModel.addCuboid(cuboid);
    }
    return blockModel;
}
