import { BlockState } from "./blockState";
import { CraftingIngredient, CraftingIngredientOptions, CraftingRecipe } from "./craftingRecipe";
import { Identifier } from "./identifier";
import { Item, ItemLike, itemLikeToString } from "./item";

interface BasicCraftingRecipeEntry {
    ingredient: CraftingIngredient;
    count: number;
}

interface SerializedCraftingItem {
    item: string | { has_tag: string };
    amount: number;
}

interface SerializedBasicCraftingRecipe {
    inputs: SerializedCraftingItem[];
    output: SerializedCraftingItem;
}
export class BasicCraftingRecipe implements CraftingRecipe<SerializedBasicCraftingRecipe> {
    public id: Identifier;
    private items: Set<BasicCraftingRecipeEntry> = new Set;
    public result: ItemLike = null;
    public resultCount: number = 1;

    public constructor(id: Identifier) {
        this.id = id;
    }

    public addItem(ingredient: CraftingIngredient | CraftingIngredientOptions | ItemLike, count: number = 1) {
        if(ingredient == null) throw new TypeError("Ingredient cannot be null");

        let instance: CraftingIngredient;
        if(ingredient instanceof CraftingIngredient) {
            instance = ingredient;
        } else {
            let options: CraftingIngredientOptions;
            if(ingredient instanceof Item || ingredient instanceof BlockState || ingredient instanceof Identifier || typeof ingredient == "string") {
                options = { item: ingredient };
            } else {
                options = ingredient as CraftingIngredientOptions;
            }
            instance = new CraftingIngredient(options);
        }

        this.items.add({ ingredient: instance, count });
        return this;
    }

    public setResult(ingredient: ItemLike, count: number = this.resultCount) {
        this.result = ingredient;
        this.resultCount = count;
        return this;
    }

    public serialize(): SerializedBasicCraftingRecipe {
        const inputs: SerializedCraftingItem[] = new Array;

        for(const entry of this.items) {
            if(entry.ingredient.tag == null) {
                inputs.push({
                    item: entry.ingredient.toString(),
                    amount: entry.count
                });
            } else {
                inputs.push({
                    item: {
                        has_tag: entry.ingredient.tag
                    },
                    amount: entry.count,
                });
            }
        }

        return {
            inputs,
            output: {
                item: itemLikeToString(this.result),
                amount: this.resultCount
            }
        }
    }

    public getRecipePath() {
        return "recipes/crafting/" + this.id.getItem() + ".json";
    }
}