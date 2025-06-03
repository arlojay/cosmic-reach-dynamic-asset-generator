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

import { Vector3 } from "three";
import { itemLikeToString } from "./item";
import { ItemLike } from "./item";
import { TriggerPredicate } from "./triggerPredicates";
import { Sound } from "./sound";
import { Identifier } from "./identifier";
import { Mod } from "./mod";
import { LootTable } from "./loot";

export interface SerializedTriggerAction {
    actionId: string;
    if?: TriggerPredicate<any>;
    parameters?: Record<string, any>;
}

export class TriggerAction<SerializedData extends Record<string, any> = {}> {
    protected mod: Mod;
    public name: string;
    public condition?: TriggerPredicate<any>;
    public parameters?: SerializedData | null;

    public constructor(parameters?: SerializedData) {
        this.parameters = parameters ?? null;
    }

    public if(condition: TriggerPredicate<any>) {
        this.condition = condition;
        return this;
    }

    protected modifyParams(params: any) {
        
    }

    public serialize(mod: Mod): SerializedTriggerAction {
        this.mod = mod;

        const object: SerializedTriggerAction = {
            actionId: this.name
        };
        if(this.condition != null) object.if = this.condition;
        
        const shallowParameterClone = this.parameters == null ? {}
            : Object.assign({}, this.parameters);

        this.modifyParams(shallowParameterClone);

        if(Object.keys(shallowParameterClone).length > 0) {
            object.parameters = shallowParameterClone;
        }

        return object;
    }
}

export class RunTriggerAction extends TriggerAction<{
    triggerId: string;
    xOff?: number;
    yOff?: number;
    zOff?: number;
    tickDelay?: number;
    addToQueue?: boolean;
    createSubqueue?: boolean;
    updateSrcBlockState?: boolean;
}> {
    public name: string = "base:run_trigger";
}

export class UpdateBlockAction extends TriggerAction<{
    xOff?: number;
    yOff?: number;
    zOff?: number;
    tickDelay?: number;
    addToQueue?: boolean;
    createSubqueue?: boolean;
}> {
    public name: string = "base:run_trigger";
    protected modifyParams(params: any): void {
        if(params == null) params = {};
        params.triggerId = "relayOnBlockUpdate";
    }
}

export class BlockEntitySignalAction extends TriggerAction<{
    xOff?: number;
    yOff?: number;
    zOff?: number;
    signal: string;
}> {
    public name: string = "base:block_entity_signal";
}

export class PlaySound2DAction extends TriggerAction<{
    sound: Sound | Identifier | string;
    volume?: number;
    pitch?: number | [ number, number ];
    pan?: number;
    global?: boolean;
}> {
    public name: string = "base:play_sound_2d";

    protected modifyParams(params: any): void {
        if(params.sound != null) {
            if(params.sound instanceof Sound) params.sound = params.sound.getAsBlockSoundId(this.mod);
            if(params.sound instanceof Identifier) params.sound = params.sound.derive("sounds/blocks/" + params.sound.getItem() + ".ogg").toString();
        }
    }
}

export class PlaySound3DAction extends TriggerAction<{
    sound: Sound | Identifier | string;
    position?: [ number, number, number ];
    volume?: number;
    pitch?: number | [ number, number ];
    global?: boolean;
}> {
    public name: string = "base:play_sound_3d";

    protected modifyParams(params: any): void {
        if(params.sound != null) {
            if(params.sound instanceof Sound) params.sound = params.sound.getAsBlockSoundId(this.mod);
            else if(params.sound instanceof Identifier) params.sound = params.sound.toString();
        }
    }
}


export class ExplodeAction extends TriggerAction<{
    radius: number;
    blockState?: ItemLike;
    xOff?: number;
    yOff?: number;
    zOff?: number;
}> {
    public name: string = "base:explode";

    protected modifyParams(params: any) {
        if(params.blockState != null) params.blockStateId = itemLikeToString(params.blockState);
        delete params.blockState;
    }
}

export class GrowTreeCoconutAction extends TriggerAction<{
    xOff?: number;
    yOff?: number;
    zOff?: number;
}> {
    public name: string = "base:grow_tree_coconut";
}

export class GrowTreePoplarAction extends TriggerAction<{
    xOff?: number;
    yOff?: number;
    zOff?: number;
}> {
    public name: string = "base:grow_tree_poplar";
}

export class LeafDecayAction extends TriggerAction<{
    maxDist?: number;
    paramName: string;
    runOnCompleteDecay: string;
}> {
    public name: string = "base:leaf_decay";
}

export class ItemDropAction extends TriggerAction<{
    position?: [ number, number, number ];
    item?: ItemLike;
}> {
    public name: string = "base:item_drop";

    protected modifyParams(params: any): void {
        if(params.item != null) params.dropId = itemLikeToString(params.item);
    }
}

export class LootDropAction extends TriggerAction<{
    position?: [ number, number, number ];
    loot: LootTable | Identifier | string;
}> {
    public name: string = "base:loot_drop";

    protected modifyParams(params: any): void {
        if(params.loot != null) {
            if(typeof params.loot == "string") params.lootId = params.loot;
            if(params.loot instanceof LootTable) params.lootId = params.loot.getLootId().toString();
            if(params.loot instanceof Identifier) params.lootId = params.loot.derive("loot/" + params.loot.getItem()).toString();
            delete params.loot;
        }
    }
}

export class ReplaceBlockStateAction extends TriggerAction<{
    xOff?: number;
    yOff?: number;
    zOff?: number;
    blockStateId: string;
}> {
    public name: string = "base:replace_block_state";
}

export class SetBlockStateParamsAction extends TriggerAction<{
    xOff?: number;
    yOff?: number;
    zOff?: number;
    params: Record<string, string>;
}> {
    public name: string = "base:set_block_state_params";
}

export class CycleBlockStateParamsAction extends TriggerAction<{
    xOff?: number;
    yOff?: number;
    zOff?: number;
    params: Record<string, string[]>;
}> {
    public name: string = "base:cycle_block_state_params";
}

export class IncrementParamAction extends TriggerAction<{
    xOff?: number;
    yOff?: number;
    zOff?: number;
    step?: number;
    paramName: string;
}> {
    public name: string = "base:increment_param";
}

export class CopyBlockStateParamsAction extends TriggerAction<{
    xOff?: number;
    yOff?: number;
    zOff?: number;
    params: string[];
}> {
    public name: string = "base:copy_block_state_params";
}

export class SetCuboidAction extends TriggerAction<{
    x1Off?: number; y1Off?: number; z1Off?: number;
    x2Off?: number; y2Off?: number; z2Off?: number;

    block: ItemLike;
    triggerBeforeSetId?: string;
    triggerAfterSetId?: string;
}> {
    public name: string = "base:set_cuboid";
    
    protected modifyParams(params: any): void {
        if(params.block != null) params.blockStateId = itemLikeToString(params.block);
    }
}

export class SetSphereAction extends TriggerAction<{
    xOff?: number; yOff?: number; zOff?: number;
    radius: number;

    block: ItemLike;
    triggerBeforeSetId?: string;
    triggerAfterSetId?: string;
}> {
    public name: string = "base:set_sphere";
    
    protected modifyParams(params: any): void {
        if(params.block != null) params.blockStateId = itemLikeToString(params.block);
    }
}

export class SetSphericalSegment extends TriggerAction<{
    xOff?: number; yOff?: number; zOff?: number;
    radius: number;
    angleDeg: number;
    xNormal: number; yNormal: number; zNormal: number;

    block: ItemLike;
    triggerBeforeSetId?: string;
    triggerAfterSetId?: string;
}> {
    public name: string = "base:set_spherical_segment";
    
    protected modifyParams(params: any): void {
        if(params.block != null) params.blockStateId = itemLikeToString(params.block);

        [ params.xNormal, params.yNormal, params.zNormal ] = new Vector3(params.xNormal, params.yNormal, params.zNormal).normalize().toArray();
    }
}

export class PushBlockAction extends TriggerAction<{
    stopTag: string;
    directionParam: string;
    pushLength: number;
    successTrigger: string;
}> {
    public name: string = "base:push_blocks";
}

export class PullBlockAction extends TriggerAction<{
    stopTag: string;
    directionParam: string;
    pullLength: number;
    successTrigger: string;
}> {
    public name: string = "base:pull_blocks";
}

export class CustomAction extends TriggerAction<{}> {
    public constructor(name: string, params: Record<string, any>) {
        super(params);

        this.name = name;
    }
}