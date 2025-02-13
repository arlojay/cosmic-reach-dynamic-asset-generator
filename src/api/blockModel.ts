import { Box2, Box3, Matrix4, Vector2, Vector3 } from "three";
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
    public uvRotation: number | null = null;

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
            object.faces.localNegZ = this.south.serialize(textureIds.get(this.south.texture));
        }
        if(this.north.texture != null) {
            object.faces.localPosZ = this.north.serialize(textureIds.get(this.north.texture));
        }

        return object;
    }
    
    public getUsedTextures() {
        return new Set(this.getAllFaces().map(v => v.texture).filter(v => v != null));
    }
}

export class SerializedBlockModel {
    textures: Record<string, SerializedBlockTexture>;
    cuboids: SerializedBlockModelCuboid[];
    cullsSelf?: boolean;
    isTransparent?: boolean;
}

export class BlockModel {
    private mod: Mod;
    private cuboids: Set<BlockModelCuboid> = new Set;
    public id: Identifier;
    public cullsSelf: boolean = null;
    public transparent: boolean = null;

    public constructor(mod: Mod, id: Identifier) {
        this.mod = mod;
        this.id = id;
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

    public clone(newId: string) {
        const model = new BlockModel(this.mod, this.id.derive(newId));
        
        model.addModel(this);

        return model;
    }

    public addModel(...models: BlockModel[]) {
        for(const model of models) {
            this.addCuboid(...model.getCuboids().map(cuboid => cuboid.clone()));
        }
    }

    public applyTransformation(transformation: Matrix4) {
        for(const cuboid of this.cuboids) {
            cuboid.applyTransformation(transformation);
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
        const serializedTextures: Map<string, SerializedBlockTexture> = new Map;

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
            serializedTextures.set(remappedId, {
                fileName: texture.getAsBlockTextureId(this.mod).toString()
            });

            for(const faceUsingTexture of allFaces.filter(face => face.texture == texture)) {
                textureIds.set(faceUsingTexture, remappedId);
            }
        }


        const object: SerializedBlockModel = {
            textures: Object.fromEntries(serializedTextures),
            cuboids: cuboids.map(cuboid => cuboid.serialize(textureIds))
        };

        if(this.cullsSelf != null) object.cullsSelf = this.cullsSelf;
        if(this.transparent != null) object.isTransparent = this.transparent;

        return object;
    }

    public getBlockModelPath() {
        return "models/blocks/" + this.id.getItem() + ".json";
    }
    public getBlockModelId() {
        return this.id.derive("models/blocks/" + this.id.getItem() + ".json");
    }
}