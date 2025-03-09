import { Block } from "./block";
import { BlockEntity } from "./blockEntity";
import { BlockModel } from "./blockModel";
import { BlockStateGenerator } from "./blockStateGenerator";
import { Crafting } from "./crafting";
import { Identifier } from "./identifier";
import { Item } from "./item";
import { LangMap } from "./lang";
import { TriggerSheet } from "./triggerSheet";

export class Mod {
    public id: string;
    public blocks: Set<Block<any>> = new Set;
    public blockModels: Set<BlockModel> = new Set;
    public triggerSheets: Set<TriggerSheet> = new Set;
    public blockStateGenerators: Set<BlockStateGenerator> = new Set;
    public items: Set<Item> = new Set;
    public langMap: LangMap = new LangMap(this);
    public crafting: Crafting = new Crafting(this);

    constructor(id: string) {
        this.id = id;
    }

    public createBlock<BlockEntityType extends BlockEntity<any> = never>(id: string): Block<BlockEntityType> {
        const block = new Block<BlockEntityType>(this, new Identifier(this, id));

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

    public createBlockStateGenerator(id: string) {
        const blockStateGenerator = new BlockStateGenerator(new Identifier(this, id));

        this.blockStateGenerators.add(blockStateGenerator);

        return blockStateGenerator;
    }

    public createItem(id: string): Item {
        const item = new Item(this, new Identifier(this, id));

        this.items.add(item);

        return item;
    }

    public createCraftingRecipe(id: string) {
        return this.crafting.createCraftingRecipe(id);
    }
    public createFurnaceRecipe(id: string) {
        return this.crafting.createFurnaceRecipe(id);
    }
}