import { Block } from "./block";
import { BlockEntity } from "./blockEntity";
import { BlockModel } from "./blockModel";
import { Crafting } from "./crafting";
import { Item } from "./item";
import { LangMap } from "./lang";
import { TriggerSheet } from "./triggerSheet";
export declare class Mod {
    id: string;
    blocks: Set<Block<any>>;
    blockModels: Set<BlockModel>;
    triggerSheets: Set<TriggerSheet>;
    items: Set<Item>;
    langMap: LangMap;
    crafting: Crafting;
    constructor(id: string);
    createBlock<BlockEntityType extends BlockEntity<any> = never>(id: string): Block<BlockEntityType>;
    createBlockModel(id: string): BlockModel;
    createTriggerSheet(id: string): TriggerSheet;
    createItem(id: string): Item;
    createCraftingRecipe(id: string): import("./craftingRecipe").CraftingRecipeList;
    createFurnaceRecipe(id: string): import("./furnaceRecipe").FurnaceRecipeList;
}
