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

import { BlockEntity } from "./blockEntity";
import { BlockState, SerializedBlockState } from "./blockState";
import { Identifier } from "./identifier";
import { LangKey } from "./lang";
import { Mod } from "./mod";
import {BlockModel} from "./blockModel";

export interface BlockProperties {
    fuelTicks: number | null;
}

export interface SerializedBlock {
    stringId: string;
    defaultProperties?: Partial<SerializedBlockState>;
    blockStates: Record<string, SerializedBlockState>;
    blockEntityId?: string;
    blockEntityParams?: any;
}

export class Block<BlockEntityType extends BlockEntity<any> = never> {
    public id: Identifier;
    private mod: Mod;

    public properties: BlockProperties;

    public fallbackParams: Partial<SerializedBlockState> = {};
    
    private blockStates: Set<BlockState> = new Set;
    public blockEntity: BlockEntityType = null;
    private defaultLangKey: LangKey | null = null;

    constructor(mod: Mod, id: Identifier) {
        this.id = id;
        this.mod = mod;
    }

    public createState(blockStateString: Map<string, string> | Record<string, string> | string | null): BlockState {
        const blockState = new BlockState(this.mod, this);
        
        this.blockStates.add(blockState);

        if(blockStateString != null) {
            if(blockStateString instanceof Map) {
                for(const [ key, value ] of blockStateString) {
                    blockState.params.set(key, value);
                }
            } else if(typeof blockStateString == "object") {
                for(const [ key, value ] of Object.entries(blockStateString)) {
                    blockState.params.set(key, value);
                }
            } else if(typeof blockStateString == "string") {
                for(const pair of blockStateString.split(",")) {
                    const [ key, value ] = pair.split("=");
                    blockState.params.set(key, value);
                }
            }
        }

        if(this.defaultLangKey != null) {
            blockState.setLangKey(this.defaultLangKey);
        }

        return blockState;
    }

    public setBlockEntity(blockEntity: BlockEntityType) {
        this.blockEntity = blockEntity;
    }

    public getStates() {
        return new Set(this.blockStates);
    }

    public createDefaultLangKey() {
        const key = this.mod.langMap.createBlockKey(this.id.getItem());
        this.defaultLangKey = key;
        return key;
    }
    public setDefaultLangKey(langKey: LangKey) {
        this.defaultLangKey = langKey;
    }

    public createDefaultModel(id?: string) {
        const model = new BlockModel(
            this.mod,
            new Identifier(
                this.mod,
                id ?? (this.id.getItem())
            )
        );

        this.fallbackParams.modelName = model.getBlockModelId().toString();

        return model;
    }
    public setDefaultModel(blockModel: BlockModel) {
        this.fallbackParams.modelName = blockModel.getBlockModelId().toString();
    }

    public serialize() {
        const blockStates: Record<string, SerializedBlockState> = {};

        for(const blockState of this.blockStates) {
            const blockStateId = blockState.compileParams();

            if(blockStateId in blockStates) throw new ReferenceError("Duplicate block state " + blockStateId);

            blockStates[blockStateId] = blockState.serialize();
        }

        const object: SerializedBlock = {
            stringId: this.id.toString(),
            blockStates
        };
        
        if(this.fallbackParams != null && Object.keys(this.fallbackParams).length > 0) object.defaultProperties = this.fallbackParams;
        if(this.blockEntity != null) {
            object.blockEntityId = this.blockEntity.id.toString();
            object.blockEntityParams = this.blockEntity.serialize();
        }

        return object;
    }
    
    public getBlockPath(): string {
        return "blocks/" + this.id.getItem() + ".json";
    }
    public getBlockId(): string {
        return this.id.toString();
    }
}