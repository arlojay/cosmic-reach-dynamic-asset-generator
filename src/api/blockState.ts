/*
Copyright 2025 arlojay

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { Block } from "./block";
import { BlockModel } from "./blockModel";
import { Identifier } from "./identifier";
import { Texture } from "./texture";
import { Mod } from "./mod";
import { TriggerSheet } from "./triggerSheet";
import { LangKey } from "./lang";
import { BlockStateGeneratorEntry } from "./blockStateGenerator";
import { BlockEventPredicate, IBlockEventPredicate } from "./triggerPredicates";

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
    placementRules?: string;
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
    canPlace?: IBlockEventPredicate;
    rotation?: [ number, number, number ];
    dropParams?: Record<string, string>;
    allowSwapping?: boolean;
    isFluid?: boolean
    itemIcon?: string;
    refractiveIndex?: number;
}

export class BlockState {
    private mod: Mod;
    private block: Block<any>;

    public params: Map<string, string> = new Map;

    public model: BlockModel;
    public triggerSheet: TriggerSheet = null;
    public isOpaque: boolean = null; // default true
    public lightAttenuation: number = null; // default 15
    public canRaycastForBreak: boolean = null; // default true
    public canRaycastForPlaceOn: boolean = null; // default true
    public canRaycastForReplace: boolean = null; // default false
    public walkThrough: boolean = null; // default false
    public tags: string[] = new Array;
    public stateGenerators: Set<BlockStateGeneratorEntry | Identifier | string> = new Set;
    public placementRules: "default" | "stairs" | "directional_towards" | "directional_away" | "omnidirectional_towards" | "omnidirectional_away" | "axis" = null;
    public hardness: number = null; // default 1?
    public dropState: BlockState = null;
    public catalogHidden: boolean = null;
    public fuelTicks: number = null; // part of intProperties.fuelTicks for some reason
    public light: [ number, number, number ] = [ 0, 0, 0 ];
    public swapGroupId: Identifier = null;
    public friction: number = null; // default 1?
    public langKey: LangKey = null;
    public bounciness: number = null; // default 0
    public canPlace: BlockEventPredicate = null;
    public rotation: [ number, number, number ] = [ 0, 0, 0 ];
    public dropParamOverrides: Record<string, string>;
    public allowSwapping: boolean = null; // default true
    public isFluid: boolean = null;
    public itemIcon: Texture = null;
    public refractiveIndex: number = null;

    public constructor(mod: Mod, block: Block<any>) {
        this.mod = mod;
        this.block = block;
    }

    public createBlockModel(id?: string) {
        const model = new BlockModel(
            this.mod,
            new Identifier(
                this.mod,
                id ?? (this.block.id.getItem() + "/" + this.compileParams("-", "_"))
            )
        );

        this.model = model;

        return model;
    }

    public setBlockModel(model: BlockModel) {
        this.model = model;
    }

    public createTriggerSheet(id?: string) {
        const triggerSheet = new TriggerSheet(
            this.mod,
            new Identifier(
                this.mod,
                id ?? (this.block.id.getItem() + "/" + this.compileParams("-", "_"))
            )
        );

        this.triggerSheet = triggerSheet;

        return triggerSheet;
    }

    public setTriggerSheet(triggerSheet: TriggerSheet) {
        this.triggerSheet = triggerSheet;
    }

    public compileParams(assigner: string = "=", delimiter: string = ",") {
        return Array.from(this.params).map(v => {
            if(v[1] == null || v[1].length == 0) return v[0];
            return v.join(assigner);
        }).join(delimiter);
    }

    public createLangKey(id: string = this.block.id.getItem() + "::" + this.compileParams("-", "_")) {
        this.langKey = this.mod.langMap.createBlockKey(id);
        return this.langKey;
    }

    public setLangKey(key: LangKey) {
        this.langKey = key;
    }

    public derive(extraProperties: Map<string, string> | Record<string, string> | string) {
        const blockState = this.block.createState(this.params);

        if(extraProperties != null) {
            if(extraProperties instanceof Map) {
                for(const [ key, value ] of extraProperties) {
                    blockState.params.set(key, value);
                }
            } else if(typeof extraProperties == "object") {
                for(const [ key, value ] of Object.entries(extraProperties)) {
                    blockState.params.set(key, value);
                }
            } else if(typeof extraProperties == "string") {
                for(const pair of extraProperties.split(",")) {
                    const [ key, value ] = pair.split("=");
                    blockState.params.set(key, value);
                }
            }
        }

        blockState.model = this.model;
        blockState.triggerSheet = this.triggerSheet;
        blockState.isOpaque = this.isOpaque;
        blockState.lightAttenuation = this.lightAttenuation;
        blockState.canRaycastForBreak = this.canRaycastForBreak;
        blockState.canRaycastForPlaceOn = this.canRaycastForPlaceOn;
        blockState.canRaycastForReplace = this.canRaycastForReplace;
        blockState.walkThrough = this.walkThrough;
        blockState.tags = Array.from(this.tags);
        blockState.stateGenerators = new Set(this.stateGenerators);
        blockState.placementRules = this.placementRules;
        blockState.hardness = this.hardness;
        blockState.dropState = this.dropState;
        blockState.catalogHidden = this.catalogHidden;
        blockState.fuelTicks = this.fuelTicks;
        blockState.light = this.light == null ? null : [this.light[0], this.light[1], this.light[2]];
        blockState.swapGroupId = this.swapGroupId;
        blockState.friction = this.friction;
        blockState.langKey = this.langKey;
        blockState.bounciness = this.bounciness;
        blockState.canPlace = this.canPlace;
        blockState.rotation = [this.rotation[0], this.rotation[1], this.rotation[2]];
        blockState.dropParamOverrides = this.dropParamOverrides;
        blockState.allowSwapping = this.allowSwapping;
        blockState.isFluid = this.isFluid;
        blockState.itemIcon = this.itemIcon;
        blockState.refractiveIndex = this.refractiveIndex;

        return blockState;
    }

    public serialize(): SerializedBlockState {
        const object: SerializedBlockState = {
            modelName: this.model.getBlockModelId().toString()
        };

        if(this.rotation != null) {
            if(this.rotation[0] != 0 || this.rotation[1] != 0 || this.rotation[2] != 0) {
                object.rotation = this.rotation;
            }
        }
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
        if(this.stateGenerators != null && this.stateGenerators.size > 0) object.stateGenerators = Array.from(this.stateGenerators).map(obj => {
            if(obj instanceof BlockStateGeneratorEntry) obj = obj.parent.getBlockStateGeneratorId();
            if(obj instanceof Identifier) obj = obj.toString();
            return obj;
        });
        if(this.placementRules != null) object.placementRules = this.placementRules;
        
        if(this.dropState != null) object.dropId = this.dropState.getFullId();
        if(this.dropParamOverrides != null) object.dropParams = this.dropParamOverrides;
        if(this.swapGroupId != null) object.swapGroupId = this.swapGroupId.toString();
        if(this.allowSwapping != null) object.allowSwapping = this.allowSwapping;
        if(this.catalogHidden != null) object.catalogHidden = this.catalogHidden;
        if(this.itemIcon != null) object.itemIcon = this.itemIcon.getAsItemTextureId(this.mod).toString();

        if(this.light[0] != 0 || this.light[1] != 0 || this.light[2] != 0) {
            object.lightLevelRed = this.light[0];
            object.lightLevelGreen = this.light[1];
            object.lightLevelBlue = this.light[2];
        }
        if(this.lightAttenuation != null) object.lightAttenuation = this.lightAttenuation;

        if(this.friction != null) object.friction = this.friction;
        if(this.bounciness != null) object.bounciness = this.bounciness;
        if(this.hardness != null) object.hardness = this.hardness;
        if(this.refractiveIndex != null) object.refractiveIndex = this.refractiveIndex;

        if(this.langKey != null) object.langKey = this.langKey.toString();

        return object;
    }
 
    public getBlock() {
        return this.block;
    }
    public getFullId(): string {
        return this.block.getBlockId() + "[" + this.compileParams() + "]";
    }
}