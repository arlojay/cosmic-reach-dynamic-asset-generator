import { ItemLike } from "./crafting";
import { TriggerPredicate } from "./triggerPredicates";
import { Sound } from "./sound";
import { Identifier } from "./identifier";
import { Mod } from "./mod";
export interface SerializedTriggerAction {
    actionId: string;
    if?: TriggerPredicate<any>;
    parameters?: Record<string, any>;
}
export declare class TriggerAction<SerializedData extends Record<string, any> = {}> {
    protected mod: Mod;
    name: string;
    condition?: TriggerPredicate<any>;
    parameters?: SerializedData | null;
    constructor(parameters?: SerializedData);
    if(condition: TriggerPredicate<any>): this;
    protected modifyParams(params: any): void;
    serialize(mod: Mod): SerializedTriggerAction;
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
export declare class BlockEntitySignalAction extends TriggerAction<{
    xOff?: number;
    yOff?: number;
    zOff?: number;
    signal: string;
}> {
    name: string;
}
export declare class PlaySound2DAction extends TriggerAction<{
    sound: Sound | Identifier | string;
    volume?: number;
    pitch?: number | [number, number];
    pan?: number;
    global?: boolean;
}> {
    name: string;
    protected modifyParams(params: any): void;
}
export declare class PlaySound3DAction extends TriggerAction<{
    sound: Sound | Identifier | string;
    position?: [number, number, number];
    volume?: number;
    pitch?: number | [number, number];
    global?: boolean;
}> {
    name: string;
    protected modifyParams(params: any): void;
}
export declare class ExplodeAction extends TriggerAction<{
    radius: number;
    blockState?: ItemLike;
    xOff?: number;
    yOff?: number;
    zOff?: number;
}> {
    name: string;
    protected modifyParams(params: any): void;
}
export declare class GrowTreeCoconutAction extends TriggerAction<{
    xOff?: number;
    yOff?: number;
    zOff?: number;
}> {
    name: string;
}
export declare class GrowTreePoplarAction extends TriggerAction<{
    xOff?: number;
    yOff?: number;
    zOff?: number;
}> {
    name: string;
}
export declare class LeafDecayAction extends TriggerAction<{
    maxDist?: number;
    paramName: string;
    runOnCompleteDecay: string;
}> {
    name: string;
}
export declare class ItemDropAction extends TriggerAction<{
    position?: [number, number, number];
    item?: ItemLike;
}> {
    name: string;
    protected modifyParams(params: any): void;
}
export declare class LootDropAction extends TriggerAction<{
    position?: [number, number, number];
    lootId: string;
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
export declare class IncrementParamAction extends TriggerAction<{
    xOff?: number;
    yOff?: number;
    zOff?: number;
    step?: number;
    paramName: string;
}> {
    name: string;
}
export declare class CopyBlockStateParamsAction extends TriggerAction<{
    xOff?: number;
    yOff?: number;
    zOff?: number;
    params: string[];
}> {
    name: string;
}
export declare class SetCuboidAction extends TriggerAction<{
    x1Off?: number;
    y1Off?: number;
    z1Off?: number;
    x2Off?: number;
    y2Off?: number;
    z2Off?: number;
    block: ItemLike;
    triggerBeforeSetId?: string;
    triggerAfterSetId?: string;
}> {
    name: string;
    protected modifyParams(params: any): void;
}
export declare class SetSphereAction extends TriggerAction<{
    xOff?: number;
    yOff?: number;
    zOff?: number;
    radius: number;
    block: ItemLike;
    triggerBeforeSetId?: string;
    triggerAfterSetId?: string;
}> {
    name: string;
    protected modifyParams(params: any): void;
}
export declare class SetSphericalSegment extends TriggerAction<{
    xOff?: number;
    yOff?: number;
    zOff?: number;
    radius: number;
    angleDeg: number;
    xNormal: number;
    yNormal: number;
    zNormal: number;
    block: ItemLike;
    triggerBeforeSetId?: string;
    triggerAfterSetId?: string;
}> {
    name: string;
    protected modifyParams(params: any): void;
}
export declare class CustomAction extends TriggerAction<{}> {
    constructor(name: string, params: Record<string, any>);
}
