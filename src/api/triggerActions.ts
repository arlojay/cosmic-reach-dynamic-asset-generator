import { TriggerPredicate } from "./triggerPredicates";

export interface SerializedTriggerAction {
    actionId: string;
    if?: TriggerPredicate<any>;
    parameters?: Record<string, any>;
}

export class TriggerAction<T extends Record<string, any> = {}> {
    public name: string;
    public condition?: TriggerPredicate<any>;
    public parameters?: T | Record<string, any> | null;

    public constructor(parameters?: T) {
        this.parameters = parameters ?? null;
    }

    public if(condition: TriggerPredicate<any>) {
        this.condition = condition;
    }

    public serialize(): SerializedTriggerAction {
        const object: SerializedTriggerAction = {
            actionId: this.name
        };
        if(this.condition != null) object.if = this.condition;
        if(this.parameters != null) object.parameters = this.parameters;

        return object;
    }
}

export class RunTriggerAction extends TriggerAction<{
    triggerId: string;
    xOff?: number;
    yOff?: number;
    zOff?: number;
    tickDelay?: number;
}> {
    public name: string = "base:run_trigger";
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