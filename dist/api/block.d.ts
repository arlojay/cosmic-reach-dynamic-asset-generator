import { BlockState, SerializedBlockState } from "./blockState";
import { Identifier } from "./identifier";
import { Mod } from "./mod";
type BlockEntity = null;
export interface BlockProperties {
    fuelTicks: number | null;
}
export interface SerializedBlock {
    stringId: string;
    defaultProperties?: SerializedBlockState;
    blockStates: Record<string, SerializedBlockState>;
}
export declare class Block {
    id: Identifier;
    private mod;
    isOpaque: boolean;
    tags: Set<string>;
    properties: BlockProperties;
    dropState: BlockState;
    defaultState: BlockState;
    fallbackParams: BlockState;
    private blockStates;
    private blockEntity;
    constructor(mod: Mod, id: Identifier);
    createState(blockStateString: Map<string, string> | Record<string, string> | string | null): BlockState;
    createBlockEntity(): BlockEntity;
    getStates(): Set<BlockState>;
    serialize(): SerializedBlock;
    getBlockPath(): string;
    getBlockId(): string;
}
export {};
