import { BlockState } from "./blockState";
import { CraftingRecipeList } from "./craftingRecipe";
import { FurnaceRecipeList } from "./furnaceRecipe";
import { Identifier } from "./identifier";
import { Item } from "./item";
import { Mod } from "./mod";

export type ItemLike = Item | BlockState | Identifier | string;

export function itemLikeToString(item: ItemLike) {
    if(item instanceof Item) return item.id.toString();
    if(item instanceof BlockState) return item.getFullId();
    return item.toString();
}

export class Crafting {
    private mod: Mod;
    public craftingRecipes: Set<CraftingRecipeList> = new Set;
    public furnaceRecipes: Set<FurnaceRecipeList> = new Set;

    public constructor(mod: Mod) {
        this.mod = mod;
    }

    public createCraftingRecipe(id: string): CraftingRecipeList {
        const list = new CraftingRecipeList(new Identifier(this.mod, id));

        this.craftingRecipes.add(list);
        return list;
    }

    public createFurnaceRecipe(id: string): FurnaceRecipeList {
        const list = new FurnaceRecipeList(new Identifier(this.mod, id));

        this.furnaceRecipes.add(list);
        return list;
    }
}