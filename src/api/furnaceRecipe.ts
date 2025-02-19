import { ItemLike, itemLikeToString } from "./crafting";
import { Identifier } from "./identifier";

export class FurnaceRecipe {
    public input: ItemLike = null;
    public output: ItemLike = null;

    public setInput(item: ItemLike) {
        this.input = item;
    }
    public setOutput(item: ItemLike) {
        this.output = item;
    }

    public addToList(list: SerializedFurnaceRecipeList) {
        list[itemLikeToString(this.input)] = itemLikeToString(this.output);
    }
}

export interface SerializedFurnaceRecipeList extends Record<string, string> {}

export class FurnaceRecipeList {
    public id: Identifier;
    private recipes: Set<FurnaceRecipe> = new Set;

    public constructor(id: Identifier) {
        this.id = id;
    }

    public createRecipe(input: ItemLike, output: ItemLike) {
        const recipe = new FurnaceRecipe;
        recipe.setInput(input);
        recipe.setOutput(output);

        this.addRecipe(recipe);

        return recipe;
    }

    public addRecipe(recipe: FurnaceRecipe) {
        this.recipes.add(recipe);
    }

    public serialize() {
        const object: SerializedFurnaceRecipeList = {};

        for(const recipe of this.recipes) recipe.addToList(object);

        return object;
    }

    public getRecipePath() {
        return "recipes/furnace/" + this.id.getItem() + ".json";
    }
}