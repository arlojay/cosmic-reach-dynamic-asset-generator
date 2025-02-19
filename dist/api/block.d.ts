import { BlockState, SerializedBlockState } from "./blockState";
import { Identifier } from "./identifier";
import { LangKey } from "./lang";
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
    properties: BlockProperties;
    defaultState: BlockState;
    fallbackParams: BlockState;
    private blockStates;
    private blockEntity;
    private defaultLangKey;
    constructor(mod: Mod, id: Identifier);
    createState(blockStateString: Map<string, string> | Record<string, string> | string | null): BlockState;
    createBlockEntity(): BlockEntity;
    getStates(): Set<BlockState>;
    createDefaultLangKey(): LangKey;
    setDefaultLangKey(langKey: LangKey): void;
    serialize(): SerializedBlock;
    getBlockPath(): string;
    getBlockId(): string;
}
export {};
