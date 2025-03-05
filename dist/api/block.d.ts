import { BlockEntity } from "./blockEntity";
import { BlockState, SerializedBlockState } from "./blockState";
import { Identifier } from "./identifier";
import { LangKey } from "./lang";
import { Mod } from "./mod";
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
export declare class Block<BlockEntityType extends BlockEntity<any> = never> {
    id: Identifier;
    private mod;
    properties: BlockProperties;
    fallbackParams: Partial<SerializedBlockState>;
    private blockStates;
    blockEntity: BlockEntityType;
    private defaultLangKey;
    constructor(mod: Mod, id: Identifier);
    createState(blockStateString: Map<string, string> | Record<string, string> | string | null): BlockState;
    setBlockEntity(blockEntity: BlockEntityType): void;
    getStates(): Set<BlockState>;
    createDefaultLangKey(): LangKey;
    setDefaultLangKey(langKey: LangKey): void;
    serialize(): SerializedBlock;
    getBlockPath(): string;
    getBlockId(): string;
}
