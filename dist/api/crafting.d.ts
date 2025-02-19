import { BlockState } from "./blockState";
import { CraftingRecipeList } from "./craftingRecipe";
import { FurnaceRecipeList } from "./furnaceRecipe";
import { Identifier } from "./identifier";
import { Item } from "./item";
import { Mod } from "./mod";
export type ItemLike = Item | BlockState | Identifier | string;
export declare function itemLikeToString(item: ItemLike): string;
export declare class Crafting {
    private mod;
    craftingRecipes: Set<CraftingRecipeList>;
    furnaceRecipes: Set<FurnaceRecipeList>;
    constructor(mod: Mod);
    createCraftingRecipe(id: string): CraftingRecipeList;
    createFurnaceRecipe(id: string): FurnaceRecipeList;
}
