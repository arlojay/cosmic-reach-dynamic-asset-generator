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
export declare class Item {
    private mod;
    id: Identifier;
    langKey: LangKey;
    texture: Texture;
    modelType: ItemModelType;
    stackLimit: number;
    toolSpeed: number;
    durability: number;
    effectiveBreakingTags: string[];
    bounciness: number;
    fuelTicks: number;
    constructor(mod: Mod, id: Identifier);
    createLangKey(): LangKey;
    setLangKey(key: LangKey): void;
    serialize(): SerializedItem;
    getItemPath(): string;
    getItemId(): string;
}
