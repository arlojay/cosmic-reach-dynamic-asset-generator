import { Block } from "./block";
import { BlockModel } from "./blockModel";
import { Identifier } from "./identifier";
import { TriggerSheet } from "./triggerSheet";

export class Mod {
    public id: string;
    public blocks: Set<Block> = new Set;
    public blockModels: Set<BlockModel> = new Set;
    public triggerSheets: Set<TriggerSheet> = new Set;

    constructor(id: string) {
        this.id = id;
    }

    public createBlock(id: string): Block {
        const block = new Block(this, new Identifier(this, id));

        this.blocks.add(block);

        return block;
    }

    public createBlockModel(id: string): BlockModel {
        const blockModel = new BlockModel(this, new Identifier(this, id));

        this.blockModels.add(blockModel);

        return blockModel;
    }

    public createTriggerSheet(id: string): TriggerSheet {
        const triggerSheet = new TriggerSheet(this, new Identifier(this, id));

        this.triggerSheets.add(triggerSheet);

        return triggerSheet;
    }
}