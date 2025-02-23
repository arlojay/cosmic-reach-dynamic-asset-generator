import { ItemLike, itemLikeToString } from "./crafting";
import { Identifier } from "./identifier";

const craftingInputSymbols = "ABCDEFGHI";


export interface CraftingRecipe<T> {
    serialize(): T;
}

export interface SerializedCraftingRecipe {
    pattern: [ string, string, string ];
    inputs: Record<string, string>;
    output: {
        item: string,
        amount: number;
    }
}

export class ShapedCraftingRecipe implements CraftingRecipe<SerializedCraftingRecipe> {
    private items: Map<string, ItemLike> = new Map;
    public result: ItemLike = null;
    public resultCount: number = 1;

    public setIngredientAt(x: number, y: number, ingredient: ItemLike) {
        if(ingredient == null) throw new TypeError("Ingredient cannot be null");

        this.items.set(x + " " + y, ingredient);
    }
    public getIngredientAt(x: number, y: number): ItemLike | null {
        return this.items.get(x + " " + y) ?? null;
    }

    public setResult(ingredient: ItemLike, count: number) {
        this.result = ingredient;
        this.resultCount = count;
    }

    public clone() {
        const recipe = new ShapedCraftingRecipe;
        for(const slot of this.items.keys()) {
            recipe.items.set(slot, this.items.get(slot));
        }

        recipe.result = this.result;
        recipe.resultCount = this.resultCount;

        return recipe;
    }

    public serialize() {
        const itemTypes: Set<string> = new Set;
        for(const item of this.items.values()) {
            itemTypes.add(itemLikeToString(item));
        }

        const inputs: Record<string, string> = {};
        const craftingSymbols: Map<string, string> = new Map;

        let itemIndex = 0;
        for(const item of itemTypes) {
            const symbol = craftingInputSymbols[itemIndex];
            inputs[symbol] = item;
            craftingSymbols.set(item, symbol);
            itemIndex++;
        }

        const pattern: [ string, string, string ] = [ "   ", "   ", "   " ];

        for(let y = 0; y < 3; y++) {
            const row: string[] = new Array(3);
            for(let x = 0; x < 3; x++) {
                const item = this.getIngredientAt(x, y);
                if(item == null) {
                    row[x] = " ";
                } else {
                    row[x] = craftingSymbols.get(itemLikeToString(item));
                }
            }
            pattern[y] = row.join("");
        }

        const object: SerializedCraftingRecipe = {
            pattern, inputs,
            output: {
                item: itemLikeToString(this.result),
                amount: this.resultCount
            }
        };

        return object;
    }
}

export interface SerializedShapelessCraftingRecipe {
    inputs: Record<string, number>[];
    output: {
        item: string;
        amount: number;
    }
}

interface ShapelessCraftingRecipeEntry {
    item: ItemLike;
    count: number;
}

export class ShapelessCraftingRecipe implements CraftingRecipe<SerializedShapelessCraftingRecipe> {
    private items: Set<ShapelessCraftingRecipeEntry> = new Set;
    public result: ItemLike = null;
    public resultCount: number = 1;

    public addItem(item: ItemLike, count: number = 1) {
        if(item == null) throw new TypeError("Ingredient cannot be null");
        this.items.add({ item, count });
    }

    public setResult(ingredient: ItemLike, count: number = this.resultCount) {
        this.result = ingredient;
        this.resultCount = count;
    }

    public serialize(): SerializedShapelessCraftingRecipe {
        const inputs: Record<string, number>[] = new Array;

        for(const entry of this.items) {
            inputs.push({ [itemLikeToString(entry.item)]: entry.count });
        }

        return {
            inputs,
            output: {
                item: itemLikeToString(this.result),
                amount: this.resultCount
            }
        }
    }
}

export interface SerializedCraftingRecipeList {
    recipes: any[];
}

export class CraftingRecipeList {
    public id: Identifier;
    public recipes: Set<CraftingRecipe<any>> = new Set;

    public constructor(id: Identifier) {
        this.id = id;
    }

    public createShaped(output: ItemLike, outputCount: number = 1) {
        const recipe = new ShapedCraftingRecipe();
        recipe.setResult(output, outputCount);

        this.recipes.add(recipe);

        return recipe;
    }

    public createShapeless(output: ItemLike, outputCount: number = 1) {
        const recipe = new ShapelessCraftingRecipe();
        recipe.setResult(output, outputCount);

        this.recipes.add(recipe);

        return recipe;
    }

    public serialize() {
        const object: SerializedCraftingRecipeList = {
            recipes: Array.from(this.recipes).map(recipe => recipe.serialize())
        };

        return object;
    }

    public getRecipePath() {
        return "recipes/crafting/" + this.id.getItem() + ".json";
    }
}