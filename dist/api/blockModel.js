"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockModel = exports.SerializedBlockModel = exports.BlockModelCuboid = exports.BlockModelFace = void 0;
const three_1 = require("three");
class BlockModelFace {
    receiveAO = null;
    texture = null;
    uvMin = new three_1.Vector2;
    uvMax = new three_1.Vector2;
    cull = false;
    uvRotation = null;
    serialize(textureId) {
        const object = {
            uv: [this.uvMin.x, this.uvMin.y, this.uvMax.x, this.uvMax.y],
            cullFace: this.cull,
            texture: textureId
        };
        if (this.receiveAO != null)
            object.ambientocclusion = this.receiveAO;
        if (this.uvRotation != null)
            object.uvRotation = this.uvRotation;
        return object;
    }
    clone() {
        const face = new BlockModelFace;
        face.receiveAO = this.receiveAO;
        face.texture = this.texture;
        face.uvMin = this.uvMin.clone();
        face.uvMax = this.uvMax.clone();
        face.cull = this.cull;
        face.uvRotation = this.uvRotation;
        return face;
    }
}
exports.BlockModelFace = BlockModelFace;
;
class BlockModelCuboid {
    box = new three_1.Box3(new three_1.Vector3(0, 0, 0), new three_1.Vector3(16, 16, 16));
    west = new BlockModelFace;
    east = new BlockModelFace;
    south = new BlockModelFace;
    north = new BlockModelFace;
    down = new BlockModelFace;
    up = new BlockModelFace;
    constructor() {
        this.recalculateUVs();
        this.recalculateCullFaces();
    }
    setSize(minX, minY, minZ, maxX, maxY, maxZ, preventUVReset = false) {
        this.box.set(new three_1.Vector3(minX, minY, minZ), new three_1.Vector3(maxX, maxY, maxZ));
        if (!preventUVReset) {
            this.recalculateUVs();
            this.recalculateCullFaces();
        }
    }
    recalculateCullFaces() {
        this.west.cull = this.box.min.x == 0;
        this.east.cull = this.box.max.x == 16;
        this.north.cull = this.box.max.z == 16;
        this.south.cull = this.box.min.z == 0;
        this.down.cull = this.box.min.y == 0;
        this.up.cull = this.box.max.y == 16;
    }
    recalculateUVs() {
        this.west.uvMin.set(this.box.min.z, this.box.min.y);
        this.west.uvMax.set(this.box.max.z, this.box.max.y);
        this.east.uvMin.set(16 - this.box.max.z, this.box.min.y);
        this.east.uvMax.set(16 - this.box.min.z, this.box.max.y);
        this.north.uvMin.set(this.box.min.x, this.box.min.y);
        this.north.uvMax.set(this.box.max.x, this.box.max.y);
        this.south.uvMin.set(16 - this.box.max.x, this.box.min.y);
        this.south.uvMax.set(16 - this.box.min.x, this.box.max.y);
        this.down.uvMin.set(this.box.min.x, this.box.min.z);
        this.down.uvMax.set(this.box.max.x, this.box.max.z);
        this.up.uvMin.set(this.box.min.x, 16 - this.box.max.z);
        this.up.uvMax.set(this.box.max.x, 16 - this.box.min.z);
        const center = new three_1.Vector2(8, 8);
        for (const face of this.getAllFaces()) {
            if (face.uvRotation != null && face.uvRotation % 180 == 90) {
                face.uvMin.rotateAround(center, Math.PI * 0.5);
                face.uvMax.rotateAround(center, Math.PI * 0.5);
                const minX = Math.min(face.uvMin.x, face.uvMax.x);
                const minY = Math.min(face.uvMin.y, face.uvMax.y);
                const maxX = Math.max(face.uvMin.x, face.uvMax.x);
                const maxY = Math.max(face.uvMin.y, face.uvMax.y);
                face.uvMin.set(minX, minY);
                face.uvMax.set(maxX, maxY);
            }
        }
    }
    getAllFaces() {
        return [
            this.west,
            this.east,
            this.down,
            this.up,
            this.south,
            this.north
        ];
    }
    applyTransformation(transformation) {
        this.box.applyMatrix4(transformation);
    }
    setAllTextures(texture) {
        for (const face of this.getAllFaces()) {
            face.texture = texture;
        }
    }
    clone() {
        const cuboid = new BlockModelCuboid;
        cuboid.west = this.west.clone();
        cuboid.east = this.east.clone();
        cuboid.north = this.north.clone();
        cuboid.south = this.south.clone();
        cuboid.down = this.down.clone();
        cuboid.up = this.up.clone();
        cuboid.box.min.copy(this.box.min);
        cuboid.box.max.copy(this.box.max);
        return cuboid;
    }
    serialize(textureIds) {
        const object = {
            localBounds: [
                this.box.min.x, this.box.min.y, this.box.min.z,
                this.box.max.x, this.box.max.y, this.box.max.z
            ],
            faces: {}
        };
        if (this.west.texture != null) {
            object.faces.localNegX = this.west.serialize(textureIds.get(this.west.texture));
        }
        if (this.east.texture != null) {
            object.faces.localPosX = this.east.serialize(textureIds.get(this.east.texture));
        }
        if (this.down.texture != null) {
            object.faces.localNegY = this.down.serialize(textureIds.get(this.down.texture));
        }
        if (this.up.texture != null) {
            object.faces.localPosY = this.up.serialize(textureIds.get(this.up.texture));
        }
        if (this.south.texture != null) {
            object.faces.localNegZ = this.south.serialize(textureIds.get(this.south.texture));
        }
        if (this.north.texture != null) {
            object.faces.localPosZ = this.north.serialize(textureIds.get(this.north.texture));
        }
        return object;
    }
    getUsedTextures() {
        return new Set(this.getAllFaces().map(v => v.texture).filter(v => v != null));
    }
}
exports.BlockModelCuboid = BlockModelCuboid;
class SerializedBlockModel {
    textures;
    cuboids;
    cullsSelf;
    isTransparent;
}
exports.SerializedBlockModel = SerializedBlockModel;
class BlockModel {
    mod;
    cuboids = new Set;
    id;
    cullsSelf = null;
    transparent = null;
    constructor(mod, id) {
        this.mod = mod;
        this.id = id;
    }
    getUsedTextures() {
        const usedTextures = new Set;
        for (const cuboid of this.cuboids) {
            for (const texture of cuboid.getUsedTextures()) {
                usedTextures.add(texture);
            }
        }
        return usedTextures;
    }
    recalculateUVs() {
        for (const cuboid of this.cuboids) {
            cuboid.recalculateUVs();
        }
    }
    createCuboid(box = new three_1.Box3(new three_1.Vector3(0, 0, 0), new three_1.Vector3(16, 16, 16))) {
        const cuboid = new BlockModelCuboid();
        cuboid.box.copy(box);
        cuboid.recalculateUVs();
        cuboid.recalculateCullFaces();
        this.cuboids.add(cuboid);
        return cuboid;
    }
    addCuboid(...cuboids) {
        for (const cuboid of cuboids) {
            this.cuboids.add(cuboid);
        }
    }
    removeCuboid(...cuboids) {
        for (const cuboid of cuboids) {
            this.cuboids.delete(cuboid);
        }
    }
    getCuboids() {
        return Array.from(this.cuboids);
    }
    clone(newId) {
        const model = new BlockModel(this.mod, this.id.derive(newId));
        model.addModel(this);
        return model;
    }
    addModel(...models) {
        for (const model of models) {
            this.addCuboid(...model.getCuboids().map(cuboid => cuboid.clone()));
        }
    }
    applyTransformation(transformation) {
        for (const cuboid of this.cuboids) {
            cuboid.applyTransformation(transformation);
        }
    }
    setAllTextures(texture) {
        for (const cuboid of this.cuboids) {
            cuboid.setAllTextures(texture);
        }
    }
    serialize() {
        const cuboids = Array.from(this.cuboids);
        const allFaces = cuboids.reduce((allFaces, cuboid) => allFaces.concat(cuboid.getAllFaces()), new Array);
        const textures = new Set(allFaces.map(face => face.texture).filter(v => v != null));
        const remappedTextures = new Map;
        const textureIds = new Map;
        const serializedTextures = new Map;
        for (const texture of textures) {
            let existingTexture;
            let remappedId;
            let i = 0;
            do {
                remappedId = (i == 0) ? (texture.id) : (texture.id + "_" + i);
                existingTexture = remappedTextures.get(remappedId);
                i++;
            } while (existingTexture != null && existingTexture != texture);
            remappedTextures.set(remappedId, texture);
            textureIds.set(texture, remappedId);
            serializedTextures.set(remappedId, {
                fileName: texture.getAsBlockTextureId(this.mod).toString()
            });
            for (const faceUsingTexture of allFaces.filter(face => face.texture == texture)) {
                textureIds.set(faceUsingTexture, remappedId);
            }
        }
        const object = {
            textures: Object.fromEntries(serializedTextures),
            cuboids: cuboids.map(cuboid => cuboid.serialize(textureIds))
        };
        if (this.cullsSelf != null)
            object.cullsSelf = this.cullsSelf;
        if (this.transparent != null)
            object.isTransparent = this.transparent;
        return object;
    }
    getBlockModelPath() {
        return "models/blocks/" + this.id.getItem() + ".json";
    }
    getBlockModelId() {
        return this.id.derive("models/blocks/" + this.id.getItem() + ".json");
    }
}
exports.BlockModel = BlockModel;
