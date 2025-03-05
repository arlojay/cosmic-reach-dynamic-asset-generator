"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockModel = exports.SerializedBlockModel = exports.BlockModelCuboid = exports.BlockModelFace = void 0;
const three_1 = require("three");
const texture_1 = require("./texture");
const identifier_1 = require("./identifier");
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
    flipVertical() {
        [this.uvMin.y, this.uvMax.y] = [this.uvMax.y, this.uvMin.y];
        if (this.uvRotation == 270)
            this.uvRotation = 90;
        else if (this.uvRotation == 90)
            this.uvRotation = 270;
    }
    flipHorizontal() {
        [this.uvMin.x, this.uvMax.x] = [this.uvMax.x, this.uvMin.x];
        if (this.uvRotation == 270)
            this.uvRotation = 90;
        else if (this.uvRotation == 90)
            this.uvRotation = 270;
    }
    rotate(angle) {
        this.uvRotation ??= 0;
        this.uvRotation = ((this.uvRotation + angle) % 360 + 360) % 360;
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
            object.faces.localPosZ = this.south.serialize(textureIds.get(this.south.texture));
        }
        if (this.north.texture != null) {
            object.faces.localNegZ = this.north.serialize(textureIds.get(this.north.texture));
        }
        return object;
    }
    getUsedTextures() {
        return new Set(this.getAllFaces().map(v => v.texture).filter(v => v != null));
    }
    rotateTexturesX(amount) {
        for (let i = 0; i < (amount % 360 + 360) % 360; i += 90) {
            this.transformFaceTextures([this.north, this.down, this.south, this.up], [this.up, this.north, this.down, this.south]);
            this.down.flipVertical();
            this.up.flipVertical();
            this.east.rotate(90);
            this.west.rotate(-90);
        }
    }
    rotateTexturesY(amount) {
        for (let i = 0; i < (amount % 360 + 360) % 360; i += 90) {
            this.transformFaceTextures([this.north, this.west, this.south, this.east], [this.east, this.north, this.west, this.south]);
            this.up.rotate(-90);
            this.north.rotate(-90);
            this.south.rotate(90);
            this.down.rotate(90);
        }
    }
    rotateTexturesZ(amount) {
        for (let i = 0; i < (amount % 360 + 360) % 360; i += 90) {
            this.transformFaceTextures([this.down, this.east, this.up, this.west], [this.west, this.down, this.east, this.up]);
            this.east.rotate(-90);
            this.east.flipVertical();
            this.up.rotate(90);
            this.west.rotate(90);
            this.west.flipVertical();
            this.down.rotate(-90);
            this.north.rotate(90);
            this.south.rotate(-90);
        }
    }
    transformFaceTextures(fromFaces, toFaces) {
        const toFacesClone = toFaces.map(face => face.clone());
        for (let i = 0; i < Math.min(fromFaces.length, toFaces.length); i++) {
            fromFaces[i].texture = toFacesClone[i].texture;
            fromFaces[i].uvMin = toFacesClone[i].uvMin;
            fromFaces[i].uvMax = toFacesClone[i].uvMax;
        }
    }
}
exports.BlockModelCuboid = BlockModelCuboid;
class SerializedBlockModel {
    textures;
    cuboids;
    cullsSelf;
    isTransparent;
    parent;
}
exports.SerializedBlockModel = SerializedBlockModel;
class BlockModel {
    static tempModelsCreated = 0;
    static nextTempModelName() {
        return "temp_model_" + (this.tempModelsCreated++);
    }
    mod;
    cuboids = new Set;
    textureOverrides = new Map;
    id;
    cullsSelf = null;
    transparent = null;
    parent = null;
    constructor(mod = null, id = new identifier_1.Identifier(mod, BlockModel.nextTempModelName())) {
        this.mod = mod;
        this.id = id;
    }
    setParent(parent) {
        this.parent = parent;
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
    addTextureOverride(texture, id) {
        this.textureOverrides.set(id, texture);
    }
    removeTextureOverride(texture) {
        if (texture instanceof texture_1.Texture) {
            for (const [key, value] of this.textureOverrides.entries()) {
                if (value == texture)
                    this.textureOverrides.delete(key);
            }
        }
        else {
            this.textureOverrides.delete(texture);
        }
    }
    getTextureOverrides() {
        return new Map(this.textureOverrides);
    }
    clone(newId = BlockModel.nextTempModelName()) {
        const model = new BlockModel(this.mod, this.id.derive(newId));
        model.addCuboid(...this.getCuboids().map(cuboid => cuboid.clone()));
        model.parent = this.parent;
        return model;
    }
    addModel(...models) {
        for (const model of models) {
            if (model.parent != null)
                console.warn("Adding a model with a parent will not work as expected (" + model.id + " to " + this.id + ")");
            this.addCuboid(...model.getCuboids().map(cuboid => cuboid.clone()));
        }
    }
    applyTransformation(transformation) {
        const toCenter = new three_1.Matrix4().setPosition(new three_1.Vector3(-8, -8, -8));
        const fromCenter = toCenter.clone().invert();
        for (const cuboid of this.cuboids) {
            cuboid.applyTransformation(toCenter);
            cuboid.applyTransformation(transformation);
            cuboid.applyTransformation(fromCenter);
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
        for (const [id, texture] of this.textureOverrides.entries()) {
            remappedTextures.set(id, texture);
            textureIds.set(texture, id);
        }
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
            for (const faceUsingTexture of allFaces.filter(face => face.texture == texture)) {
                textureIds.set(faceUsingTexture, remappedId);
            }
        }
        const object = {};
        if (remappedTextures.size > 0)
            object.textures = Object.fromEntries(remappedTextures.entries()
                .map(([id, texture]) => ([
                id,
                { fileName: texture.getAsBlockTextureId(this.mod).toString() }
            ])));
        if (cuboids.length > 0)
            object.cuboids = cuboids.map(cuboid => cuboid.serialize(textureIds));
        if (this.cullsSelf != null)
            object.cullsSelf = this.cullsSelf;
        if (this.transparent != null)
            object.isTransparent = this.transparent;
        if (this.parent != null) {
            if (this.parent instanceof BlockModel) {
                object.parent = this.parent.getBlockModelId().toString();
            }
            else if (this.parent instanceof identifier_1.Identifier) {
                object.parent = this.parent.derive("models/blocks/" + this.parent.getItem() + ".json").toString();
            }
            else {
                object.parent = this.parent;
            }
        }
        return object;
    }
    rotateX(amount) {
        const transformation = new three_1.Matrix4().makeRotationFromEuler(new three_1.Euler(-amount * Math.PI / 180, 0, 0));
        this.applyTransformation(transformation);
        for (const cuboid of this.cuboids) {
            cuboid.rotateTexturesX(amount);
        }
        return this;
    }
    rotateY(amount) {
        const transformation = new three_1.Matrix4().makeRotationFromEuler(new three_1.Euler(0, amount * Math.PI / 180, 0));
        this.applyTransformation(transformation);
        for (const cuboid of this.cuboids) {
            cuboid.rotateTexturesY(amount);
        }
        return this;
    }
    rotateZ(amount) {
        const transformation = new three_1.Matrix4().makeRotationFromEuler(new three_1.Euler(0, 0, amount * Math.PI / 180));
        this.applyTransformation(transformation);
        for (const cuboid of this.cuboids) {
            cuboid.rotateTexturesZ(amount);
        }
        return this;
    }
    realize() {
        if (this.parent == null)
            return this;
        if (this.parent instanceof BlockModel) {
            this.addModel(this.parent.realize());
            for (const cuboid of this.getCuboids()) {
                for (const face of cuboid.getAllFaces()) {
                    if (typeof face.texture == "string") {
                        face.texture = this.textureOverrides.get(face.texture);
                    }
                }
            }
        }
        else {
            console.warn("model " + this.id + " cannot realize a non-BlockModel parent (" + this.parent + ")");
        }
        return this;
    }
    getBlockModelPath() {
        return "models/blocks/" + this.id.getItem() + ".json";
    }
    getBlockModelId() {
        return this.id.derive("models/blocks/" + this.id.getItem() + ".json");
    }
}
exports.BlockModel = BlockModel;
