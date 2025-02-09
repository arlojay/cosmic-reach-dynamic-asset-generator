import { Block } from "./block";
import { BlockModel } from "./blockModel";
import { TriggerSheet } from "./triggerSheet";
export declare class Mod {
    id: string;
    blocks: Set<Block>;
    blockModels: Set<BlockModel>;
    triggerSheets: Set<TriggerSheet>;
    constructor(id: string);
    createBlock(id: string): Block;
    createBlockModel(id: string): BlockModel;
    createTriggerSheet(id: string): TriggerSheet;
}
