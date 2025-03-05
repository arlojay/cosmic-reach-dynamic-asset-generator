import { ItemLike } from "./crafting";
import { Identifier } from "./identifier";
export interface CraftingRecipe<T> {
    serialize(): T;
}
export interface SerializedCraftingRecipe {
    pattern: [string, string, string];
    inputs: Record<string, string>;
    output: {
        item: string;
        amount: number;
    };
}
export interface CraftingIngredientOptions {
    item?: ItemLike;
    tag?: string;
}
export declare class CraftingIngredient implements CraftingIngredientOptions {
    item: ItemLike;
    tag: string;
    constructor(options: CraftingIngredientOptions);
    serialize(): any;
    toString(): string;
}
export declare class ShapedCraftingRecipe implements CraftingRecipe<SerializedCraftingRecipe> {
    private items;
    result: ItemLike;
    resultCount: number;
    setIngredientAt(x: number, y: number, ingredient: CraftingIngredient | CraftingIngredientOptions | ItemLike): void;
    getIngredientAt(x: number, y: number): CraftingIngredient | null;
    setResult(ingredient: ItemLike, count: number): void;
    clone(): ShapedCraftingRecipe;
    flip(flipX: boolean, flipY: boolean): this;
    translate(x: number, y: number): this;
    rotate(angle: number): this;
    private transform;
    serialize(): SerializedCraftingRecipe;
}
export interface SerializedShapelessCraftingRecipe {
    inputs: Record<string, number>[];
    output: {
        item: string;
        amount: number;
    };
}
export declare class ShapelessCraftingRecipe implements CraftingRecipe<SerializedShapelessCraftingRecipe> {
    private items;
    result: ItemLike;
    resultCount: number;
    addItem(item: ItemLike, count?: number): void;
    setResult(ingredient: ItemLike, count?: number): void;
    serialize(): SerializedShapelessCraftingRecipe;
}
export interface SerializedCraftingRecipeList {
    recipes: any[];
}
export declare class CraftingRecipeList {
    id: Identifier;
    recipes: Set<CraftingRecipe<any>>;
    constructor(id: Identifier);
    createShaped(output: ItemLike, outputCount?: number): ShapedCraftingRecipe;
    createShapeless(output: ItemLike, outputCount?: number): ShapelessCraftingRecipe;
    add<T>(recipe: CraftingRecipe<T>): void;
    serialize(): SerializedCraftingRecipeList;
    getRecipePath(): string;
}
