import { Block } from "./block";
import { BlockModel } from "./blockModel";
import { Identifier } from "./identifier";
import { Texture } from "./texture";
import { Mod } from "./mod";
import { TriggerSheet } from "./triggerSheet";
import { LangKey, LangKeyLanguage } from "./lang";

export interface SerializedBlockState {
    modelName: string;
    blockEventsId?: string;
    isOpaque?: boolean;
    lightAttenuation?: number;
    canRaycastForBreak?: boolean;
    canRaycastForPlaceOn?: boolean;
    canRaycastForReplace?: boolean;
    walkThrough?: boolean;
    tags?: string[];
    stateGenerators?: string[];
    hardness?: number;
    dropId?: string;
    catalogHidden?: boolean;
    intProperties?: {
        fuelTicks?: number;
    };
    lightLevelRed?: number;
    lightLevelGreen?: number;
    lightLevelBlue?: number;
    swapGroupId?: string;
    friction?: number;
    langKey?: string;
    bounciness?: number;
    canPlace?: boolean;
    rotXZ?: number;
    dropParamOverrides?: Record<string, string>;
    allowSwapping?: boolean;
    isFluid?: boolean
    itemIcon?: string;
}

export class BlockState {
    private mod: Mod;
    private block: Block;

    public params: Map<string, string> = new Map;

    public model: BlockModel;
    public triggerSheet: TriggerSheet = null;
    public isOpaque: boolean = true;
    public lightAttenuation: number | null = null; // default 15
    public canRaycastForBreak: boolean | null = null; // default true
    public canRaycastForPlaceOn: boolean | null = null; // default true
    public canRaycastForReplace: boolean | null = null; // default false
    public walkThrough: boolean | null = null; // default false
    public tags: string[] = new Array;
    public stateGenerators: string[] = new Array;
    public hardness: number | null = null; // default 1?
    public dropState: BlockState | null = null;
    public catalogHidden: boolean | null = null;
    public fuelTicks: number | null = null; // part of intProperties.fuelTicks for some reason
    public light: [ number, number, number ] | null = null;
    public swapGroupId: Identifier | null = null;
    public friction: number | null = null; // default 1?
    public langKey: LangKey | null = null;
    public bounciness: number | null = null; // default 0
    public canPlace: null = null; // TODO
    public rotXZ: number | null = null; // default 0, valid: 0, 90, 180, 270
    public dropParamOverrides: Record<string, string>;
    public allowSwapping: boolean | null = null; // default true
    public isFluid: boolean | null = null;
    public itemIcon: Texture | null = null;

    public constructor(mod: Mod, block: Block) {
        this.mod = mod;
        this.block = block;
    }

    public createBlockModel(id?: string) {
        const model = this.mod.createBlockModel(id ?? 
            (this.block.id.getItem() + "/" + this.compileParams().replace(/\=/g, "-").replace(/\,/g, "_"))
        );

        this.model = model;

        return model;
    }

    public setBlockModel(model: BlockModel) {
        this.model = model;
    }

    public createTriggerSheet(id?: string) {
        const triggerSheet = this.mod.createTriggerSheet(id ??
            (this.block.id.getItem() + "/" + this.compileParams().replace(/\=/g, "-").replace(/\,/g, "_"))
        );

        this.triggerSheet = triggerSheet;

        return triggerSheet;
    }

    public setTriggerSheet(triggerSheet: TriggerSheet) {
        this.triggerSheet = triggerSheet;
    }

    public compileParams() {
        return Array.from(this.params).map(v => {
            if(v[1] == null || v[1].length == 0) return v[0];
            return v.join("=");
        }).join(",");
    }

    public createLangKey() {
        const id = this.block.id.getItem() + "::" + this.compileParams().replace(/\=/g, "-").replace(/\,/g, "_");
        this.langKey = this.mod.langMap.createBlockKey(id);
        return this.langKey;
    }

    public setLangKey(key: LangKey) {
        this.langKey = key;
    }

    public serialize(): SerializedBlockState {
        const object: SerializedBlockState = {
            modelName: this.model.getBlockModelId().toString()
        };

        if(this.rotXZ != null) object.rotXZ = this.rotXZ;
        if(this.triggerSheet != null) object.blockEventsId = this.triggerSheet.getTriggerSheetId().toString();
        if(this.canPlace != null) object.canPlace = this.canPlace;

        if(this.fuelTicks != null) object.intProperties = {
            fuelTicks: this.fuelTicks
        };

        if(this.canRaycastForBreak != null) object.canRaycastForBreak = this.canRaycastForBreak;
        if(this.canRaycastForPlaceOn != null) object.canRaycastForPlaceOn = this.canRaycastForPlaceOn;
        if(this.canRaycastForReplace != null) object.canRaycastForReplace = this.canRaycastForReplace;

        if(this.isFluid != null) object.isFluid = this.isFluid;
        if(this.walkThrough != null) object.walkThrough = this.walkThrough;
        if(this.isOpaque != null) object.isOpaque = this.isOpaque;

        if(this.tags != null && this.tags.length > 0) object.tags = this.tags;
        if(this.stateGenerators != null && this.stateGenerators.length > 0) object.stateGenerators = this.stateGenerators;
        
        if(this.dropState != null) object.dropId = this.dropState.getFullId();
        if(this.dropParamOverrides != null) object.dropParamOverrides = this.dropParamOverrides;
        if(this.swapGroupId != null) object.swapGroupId = this.swapGroupId.toString();
        if(this.allowSwapping != null) object.allowSwapping = this.allowSwapping;
        if(this.catalogHidden != null) object.catalogHidden = this.catalogHidden;
        if(this.itemIcon != null) object.itemIcon = this.itemIcon.getAsItemTextureId(this.mod).toString();

        if(this.light != null) {
            object.lightLevelRed = this.light[0];
            object.lightLevelGreen = this.light[1];
            object.lightLevelBlue = this.light[2];
        }
        if(this.lightAttenuation != null) object.lightAttenuation = this.lightAttenuation;

        if(this.friction != null) object.friction = this.friction;
        if(this.bounciness != null) object.bounciness = this.bounciness;
        if(this.hardness != null) object.hardness = this.hardness;

        if(this.langKey != null) object.langKey = this.langKey.toString();

        return object;
    }
    
    public getFullId(): string {
        return this.block.getBlockId() + "[" + this.compileParams() + "]";
    }
}