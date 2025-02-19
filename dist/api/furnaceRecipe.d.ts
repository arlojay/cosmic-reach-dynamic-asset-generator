import { ItemLike } from "./crafting";
import { Identifier } from "./identifier";
export declare class FurnaceRecipe {
    input: ItemLike;
    output: ItemLike;
    setInput(item: ItemLike): void;
    setOutput(item: ItemLike): void;
    addToList(list: SerializedFurnaceRecipeList): void;
}
export interface SerializedFurnaceRecipeList extends Record<string, string> {
}
export declare class FurnaceRecipeList {
    id: Identifier;
    private recipes;
    constructor(id: Identifier);
    createRecipe(input: ItemLike, output: ItemLike): FurnaceRecipe;
    addRecipe(recipe: FurnaceRecipe): void;
    serialize(): SerializedFurnaceRecipeList;
    getRecipePath(): string;
}
