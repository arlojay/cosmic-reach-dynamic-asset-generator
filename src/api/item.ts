import { Identifier } from "./identifier";
import { LangKey } from "./lang";
import { Mod } from "./mod";
import { Texture } from "./texture";

export type ItemModelType = "base:item3D";

export interface SerializedItemProperties {
    texture: string;
    modelType: ItemModelType;
    stackLimit?: number;
    toolSpeed?: number;
    durability?: number;
    effectiveBreakingTags?: string[];
    bounciness?: number;
    fuelTicks?: number;
}
export interface SerializedItem {
    id: string;
    itemProperties: SerializedItemProperties;
}

export class Item {
    private mod: Mod;
    public id: Identifier;

    public langKey: LangKey;

    public texture: Texture;
    public modelType: ItemModelType = "base:item3D";
    public stackLimit: number = null; // default 1000

    public toolSpeed: number = null;
    public durability: number = null;
    public effectiveBreakingTags: string[] = new Array;

    public bounciness: number = null;
    public fuelTicks: number = null;

    public constructor(mod: Mod, id: Identifier) {
        this.mod = mod;
        this.id = id;
    }
    
    public createLangKey() {
        this.langKey = this.mod.langMap.createItemKey(this.id.getItem());
        return this.langKey;
    }

    public setLangKey(key: LangKey) {
        this.langKey = key;
    }

    public serialize(): SerializedItem {
        const object: SerializedItem = {
            id: this.id.toString(),
            itemProperties: {
                texture: this.texture.getAsItemTextureId(this.mod).toString(),
                modelType: this.modelType
            }
        };

        if(this.stackLimit != null) object.itemProperties.stackLimit = this.stackLimit;

        if(this.toolSpeed != null) object.itemProperties.toolSpeed = this.toolSpeed;
        if(this.durability != null) object.itemProperties.durability = this.durability;

        if(this.effectiveBreakingTags.length > 0)
            object.itemProperties.effectiveBreakingTags = this.effectiveBreakingTags;

        if(this.bounciness != null) object.itemProperties.bounciness = this.bounciness;
        if(this.fuelTicks != null) object.itemProperties.fuelTicks = this.fuelTicks;

        return object;
    }
    
    public getItemPath(): string {
        return "items/" + this.id.getItem() + ".json";
    }
    public getItemId(): string {
        return this.id.toString();
    }
}