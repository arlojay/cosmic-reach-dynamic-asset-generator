import { TriggerPredicate } from "./triggerPredicates";
export interface SerializedTriggerAction {
    actionId: string;
    if?: TriggerPredicate<any>;
    parameters?: Record<string, any>;
}
export declare class TriggerAction<T extends Record<string, any> = {}> {
    name: string;
    condition?: TriggerPredicate<any>;
    parameters?: T | Record<string, any> | null;
    constructor(parameters?: T);
    if(condition: TriggerPredicate<any>): this;
    serialize(): SerializedTriggerAction;
}
export declare class RunTriggerAction extends TriggerAction<{
    triggerId: string;
    xOff?: number;
    yOff?: number;
    zOff?: number;
    tickDelay?: number;
}> {
    name: string;
}
export declare class ReplaceBlockStateAction extends TriggerAction<{
    xOff?: number;
    yOff?: number;
    zOff?: number;
    blockStateId: string;
}> {
    name: string;
}
export declare class SetBlockStateParamsAction extends TriggerAction<{
    xOff?: number;
    yOff?: number;
    zOff?: number;
    params: Record<string, string>;
}> {
    name: string;
}
export declare class CycleBlockStateParamsAction extends TriggerAction<{
    xOff?: number;
    yOff?: number;
    zOff?: number;
    params: Record<string, string[]>;
}> {
    name: string;
}
export declare class CustomAction extends TriggerAction<{}> {
    constructor(name: string, params: Record<string, any>);
}
export declare class ItemDropAction extends TriggerAction<{
    position: [number, number, number];
}> {
    name: string;
}
