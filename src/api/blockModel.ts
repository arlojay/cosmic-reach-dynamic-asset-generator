import { Box3, Euler, Matrix4, Vector2, Vector3 } from "three";
import { Texture } from "./texture";
import { Mod } from "./mod";
import { Identifier } from "./identifier";

export interface SerializedBlockModelFace {
    uv: [ number, number, number, number ];
    ambientocclusion?: boolean;
    cullFace: boolean;
    texture: string;
    uvRotation?: number;
}

export class BlockModelFace {
    public receiveAO: boolean | null = null;
    public texture: Texture | null = null;

    public uvMin: Vector2 = new Vector2;
    public uvMax: Vector2 = new Vector2;
    public cull: boolean = false;
    public uvRotation: (0 | 90 | 180 | 270) | null = null;

    public serialize(textureId: string): SerializedBlockModelFace {
        const object: SerializedBlockModelFace = {
            uv: [ this.uvMin.x, this.uvMin.y, this.uvMax.x, this.uvMax.y ],
            cullFace: this.cull,
            texture: textureId
        };

        if(this.receiveAO != null) object.ambientocclusion = this.receiveAO;
        if(this.uvRotation != null) object.uvRotation = this.uvRotation;

        return object;
    }

    public clone() {
        const face = new BlockModelFace;

        face.receiveAO = this.receiveAO;
        face.texture = this.texture;
        face.uvMin = this.uvMin.clone();
        face.uvMax = this.uvMax.clone();
        face.cull = this.cull;
        face.uvRotation = this.uvRotation;

        return face;
    }

    public flipVertical() {
        [ this.uvMin.y, this.uvMax.y ] = [ this.uvMax.y, this.uvMin.y ];
        if(this.uvRotation == 270) this.uvRotation = 90;
        else if(this.uvRotation == 90) this.uvRotation = 270;
    }

    public flipHorizontal() {
        [ this.uvMin.x, this.uvMax.x ] = [ this.uvMax.x, this.uvMin.x ];
        if(this.uvRotation == 270) this.uvRotation = 90;
        else if(this.uvRotation == 90) this.uvRotation = 270;
    }

    public rotate(angle: number) {
        this.uvRotation ??= 0;
        this.uvRotation = ((this.uvRotation + angle) % 360 + 360) % 360 as typeof this.uvRotation;
    }
}

interface SerializedBlockTexture {
    fileName: string
};

export interface SerializedBlockModelCuboid {
    localBounds: [
        number, number, number,
        number, number, number
    ],
    faces: {
        localNegX?: SerializedBlockModelFace,
        localPosX?: SerializedBlockModelFace,
        localNegY?: SerializedBlockModelFace,
        localPosY?: SerializedBlockModelFace,
        localNegZ?: SerializedBlockModelFace,
        localPosZ?: SerializedBlockModelFace
    }
}

export class BlockModelCuboid {
    public box: Box3 = new Box3(new Vector3(0, 0, 0), new Vector3(16, 16, 16));

    public west = new BlockModelFace;
    public east = new BlockModelFace;
    public south = new BlockModelFace;
    public north = new BlockModelFace;
    public down = new BlockModelFace;
    public up = new BlockModelFace;

    public constructor() {
        this.recalculateUVs();
        this.recalculateCullFaces();
    }

    public setSize(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number, preventUVReset: boolean = false) {
        this.box.set(
            new Vector3(minX, minY, minZ),
            new Vector3(maxX, maxY, maxZ)
        );

        if(!preventUVReset) {
            this.recalculateUVs();
            this.recalculateCullFaces();
        }
    }

    public recalculateCullFaces() {
        this.west.cull = this.box.min.x == 0;
        this.east.cull = this.box.max.x == 16;
        this.north.cull = this.box.max.z == 16;
        this.south.cull = this.box.min.z == 0;
        this.down.cull = this.box.min.y == 0;
        this.up.cull = this.box.max.y == 16;
    }

    public recalculateUVs() {
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

        const center = new Vector2(8, 8);
        for(const face of this.getAllFaces()) {
            if(face.uvRotation != null && face.uvRotation % 180 == 90) {
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

    public getAllFaces() {
        return [
            this.west,
            this.east,
            this.down,
            this.up,
            this.south,
            this.north
        ];
    }

    public applyTransformation(transformation: Matrix4) {
        this.box.applyMatrix4(transformation);
    }

    public setAllTextures(texture: Texture) {
        for(const face of this.getAllFaces()) {
            face.texture = texture;
        }
    }

    public clone() {
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

    public serialize(textureIds: Map<Texture, string>): SerializedBlockModelCuboid {
        const object: SerializedBlockModelCuboid = {
            localBounds: [
                this.box.min.x, this.box.min.y, this.box.min.z,
                this.box.max.x, this.box.max.y, this.box.max.z
            ],
            faces: {}
        };
        
        if(this.west.texture != null) {
            object.faces.localNegX = this.west.serialize(textureIds.get(this.west.texture));
        }
        if(this.east.texture != null) {
            object.faces.localPosX = this.east.serialize(textureIds.get(this.east.texture));
        }
        if(this.down.texture != null) {
            object.faces.localNegY = this.down.serialize(textureIds.get(this.down.texture));
        }
        if(this.up.texture != null) {
            object.faces.localPosY = this.up.serialize(textureIds.get(this.up.texture));
        }
        if(this.south.texture != null) {
            object.faces.localPosZ = this.south.serialize(textureIds.get(this.south.texture));
        }
        if(this.north.texture != null) {
            object.faces.localNegZ = this.north.serialize(textureIds.get(this.north.texture));
        }

        return object;
    }
    
    public getUsedTextures() {
        return new Set(this.getAllFaces().map(v => v.texture).filter(v => v != null));
    }

    public rotateTexturesX(amount: number) {
        for(let i = 0; i < (amount % 360 + 360) % 360; i += 90) {

            this.transformFaceTextures(
                [ this.north, this.down, this.south, this.up ],
                [ this.up, this.north, this.down, this.south ]
            );

            this.down.flipVertical();
            this.up.flipVertical();

            this.east.rotate(90);
            this.west.rotate(-90);
        }
    }

    public rotateTexturesY(amount: number) {
        for(let i = 0; i < (amount % 360 + 360) % 360; i += 90) {
            this.transformFaceTextures(
                [ this.north, this.west, this.south, this.east ],
                [ this.east, this.north, this.west, this.south ]
            );

            this.up.rotate(-90);
            this.north.rotate(-90);
            this.south.rotate(90);
            this.down.rotate(90);
        }
    }

    public rotateTexturesZ(amount: number) {
        for(let i = 0; i < (amount % 360 + 360) % 360; i += 90) {
            this.transformFaceTextures(
                [ this.down, this.east, this.up, this.west ],
                [ this.west, this.down, this.east, this.up ]
            );

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

    private transformFaceTextures(fromFaces: BlockModelFace[], toFaces: BlockModelFace[]) {
        const toFacesClone = toFaces.map(face => face.clone());

        for(let i = 0; i < Math.min(fromFaces.length, toFaces.length); i++) {
            fromFaces[i].texture = toFacesClone[i].texture;
            fromFaces[i].uvMin = toFacesClone[i].uvMin;
            fromFaces[i].uvMax = toFacesClone[i].uvMax;
        }
    }
}

export class SerializedBlockModel {
    textures?: Record<string, SerializedBlockTexture>;
    cuboids?: SerializedBlockModelCuboid[];
    cullsSelf?: boolean;
    isTransparent?: boolean;
    parent?: string;
}

export class BlockModel {
    private static tempModelsCreated: number = 0;
    private static nextTempModelName(): string {
        return "temp_model_" + (this.tempModelsCreated++);
    }

    private mod: Mod;
    private cuboids: Set<BlockModelCuboid> = new Set;
    private textureOverrides: Map<string, Texture> = new Map;

    public id: Identifier;
    public cullsSelf: boolean = null;
    public transparent: boolean = null;
    public parent: Identifier | string | BlockModel = null;

    public constructor(mod: Mod = null, id: Identifier = new Identifier(mod, BlockModel.nextTempModelName())) {
        this.mod = mod;
        this.id = id;
    }

    public setParent(parent: Identifier | string | BlockModel) {
        this.parent = parent;
    }

    public getUsedTextures() {
        const usedTextures: Set<Texture> = new Set;

        for(const cuboid of this.cuboids) {
            for(const texture of cuboid.getUsedTextures()) {
                usedTextures.add(texture);
            }
        }

        return usedTextures;
    }

    public recalculateUVs() {
        for(const cuboid of this.cuboids) {
            cuboid.recalculateUVs();
        }
    }

    public createCuboid(box: Box3 = new Box3(new Vector3(0, 0, 0), new Vector3(16, 16, 16))) {
        const cuboid = new BlockModelCuboid();
        cuboid.box.copy(box);
        cuboid.recalculateUVs();
        cuboid.recalculateCullFaces();

        this.cuboids.add(cuboid);

        return cuboid;
    }

    public addCuboid(...cuboids: BlockModelCuboid[]) {
        for(const cuboid of cuboids) {
            this.cuboids.add(cuboid);
        }
    }

    public removeCuboid(...cuboids: BlockModelCuboid[]) {
        for(const cuboid of cuboids) {
            this.cuboids.delete(cuboid);
        }
    }

    public getCuboids(): BlockModelCuboid[] {
        return Array.from(this.cuboids);
    }

    public addTextureOverride(texture: Texture, id: string) {
        this.textureOverrides.set(id, texture);
    }

    public removeTextureOverride(texture: Texture | string) {
        if(texture instanceof Texture) {
            for(const [key, value] of this.textureOverrides.entries()) {
                if(value == texture) this.textureOverrides.delete(key);
            }
        } else {
            this.textureOverrides.delete(texture);
        }
    }

    public getTextureOverrides() {
        return new Map(this.textureOverrides);
    }

    public clone(newId: string = BlockModel.nextTempModelName()) {
        const model = new BlockModel(this.mod, this.id.derive(newId));
        model.addCuboid(...this.getCuboids().map(cuboid => cuboid.clone()))
        model.parent = this.parent;
        model.cullsSelf = this.cullsSelf;
        model.transparent = this.transparent;
        return model;
    }

    public addModel(...models: BlockModel[]) {
        for(const model of models) {
            if(model.parent != null) console.warn("Adding a model with a parent will not work as expected (" + model.id + " to " + this.id + ")")
            this.addCuboid(...model.getCuboids().map(cuboid => cuboid.clone()));
        }
    }

    public applyTransformation(transformation: Matrix4) {
        const toCenter = new Matrix4().setPosition(new Vector3(-8, -8, -8));
        const fromCenter = toCenter.clone().invert();

        for(const cuboid of this.cuboids) {
            cuboid.applyTransformation(toCenter);
            cuboid.applyTransformation(transformation);
            cuboid.applyTransformation(fromCenter);
        }
    }

    public setAllTextures(texture: Texture) {
        for(const cuboid of this.cuboids) {
            cuboid.setAllTextures(texture);
        }
    }

    public serialize(): SerializedBlockModel {
        const cuboids = Array.from(this.cuboids);
        const allFaces = cuboids.reduce((allFaces, cuboid) => allFaces.concat(cuboid.getAllFaces()), new Array);

        const textures = new Set(allFaces.map(face => face.texture).filter(v => v != null));

        const remappedTextures: Map<string, Texture> = new Map;
        const textureIds: Map<Texture, string> = new Map;

        for(const [ id, texture ] of this.textureOverrides.entries()) {
            remappedTextures.set(id, texture);
            textureIds.set(texture, id);
        }

        for(const texture of textures) {
            let existingTexture: Texture;
            let remappedId: string;

            let i = 0;
            do {
                remappedId = (i == 0) ? (texture.id) : (texture.id + "_" + i);
                existingTexture = remappedTextures.get(remappedId);

                i++;
            } while(existingTexture != null && existingTexture != texture);
            
            remappedTextures.set(remappedId, texture);
            textureIds.set(texture, remappedId);

            for(const faceUsingTexture of allFaces.filter(face => face.texture == texture)) {
                textureIds.set(faceUsingTexture, remappedId);
            }
        }


        const object: SerializedBlockModel = {};
        if(remappedTextures.size > 0) object.textures = Object.fromEntries(remappedTextures.entries()
            .map(
                ([
                    id,
                    texture
                ]) => ([
                    id,
                    { fileName: texture.getAsBlockTextureId(this.mod).toString() }
                ])
            )
        );
        if(cuboids.length > 0) object.cuboids = cuboids.map(cuboid => cuboid.serialize(textureIds));

        if(this.cullsSelf != null) object.cullsSelf = this.cullsSelf;
        if(this.transparent != null) object.isTransparent = this.transparent;

        if(this.parent != null) {
            if(this.parent instanceof BlockModel) {
                object.parent = this.parent.getBlockModelId().toString();
            } else if(this.parent instanceof Identifier) {
                object.parent = this.parent.derive("models/blocks/" + this.parent.getItem() + ".json").toString();
            } else {
                object.parent = this.parent;
            }
        }

        return object;
    }

    public rotateX(amount: number) {
        const transformation = new Matrix4().makeRotationFromEuler(new Euler(-amount * Math.PI / 180, 0, 0));
        this.applyTransformation(transformation);

        for(const cuboid of this.cuboids) {
            cuboid.rotateTexturesX(amount);
        }

        return this;
    }
    public rotateY(amount: number) {
        const transformation = new Matrix4().makeRotationFromEuler(new Euler(0, amount * Math.PI / 180, 0));
        this.applyTransformation(transformation);

        for(const cuboid of this.cuboids) {
            cuboid.rotateTexturesY(amount);
        }

        return this;
    }
    public rotateZ(amount: number) {
        const transformation = new Matrix4().makeRotationFromEuler(new Euler(0, 0, amount * Math.PI / 180));
        this.applyTransformation(transformation);

        for(const cuboid of this.cuboids) {
            cuboid.rotateTexturesZ(amount);
        }

        return this;
    }

    public realize() {
        if(this.parent == null) return this;

        if(this.parent instanceof BlockModel) {
            this.addModel(this.parent.realize());

            for(const cuboid of this.getCuboids()) {
                for(const face of cuboid.getAllFaces()) {
                    if(typeof face.texture == "string") {
                        face.texture = this.textureOverrides.get(face.texture);
                    }
                }
            }
        } else {
            console.warn("model " + this.id + " cannot realize a non-BlockModel parent (" + this.parent + ")")
        }

        return this;
    }

    public getBlockModelPath() {
        return "models/blocks/" + this.id.getItem() + ".json";
    }
    public getBlockModelId() {
        return this.id.derive("models/blocks/" + this.id.getItem() + ".json");
    }
}