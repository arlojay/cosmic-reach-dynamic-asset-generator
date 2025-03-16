/*
Copyright 2025 arlojay

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { Box2, Matrix3, Vector2 } from "three";
import { itemLikeToString } from "./item";
import { ItemLike } from "./item";
import { Identifier } from "./identifier";
import { Item } from "./item";
import { BlockState } from "./blockState";

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

export interface CraftingIngredientOptions {
    item?: ItemLike;
    tag?: string;
}
export class CraftingIngredient implements CraftingIngredientOptions {
    public item: ItemLike = null;
    public tag: string = null;
    
    constructor(options: CraftingIngredientOptions) {
        if(options.item != null) this.item = options.item;
        if(options.tag != null) this.tag = options.tag;
    }

    public serialize(): any {
        if(this.tag != null) return { has_tag: this.tag };
        return itemLikeToString(this.item);
    }


    public toString(): string {
        if(this.item != null) return itemLikeToString(this.item);
        if(this.tag != null) return "::" + this.tag;

        throw new ReferenceError("Ingredient must have an `item` or `tag`", { cause: this });
    }
}

export class ShapedCraftingRecipe implements CraftingRecipe<SerializedCraftingRecipe> {
    private items: Map<string, CraftingIngredient> = new Map;
    public result: ItemLike = null;
    public resultCount: number = 1;

    public setIngredientAt(x: number, y: number, ingredient: CraftingIngredient | CraftingIngredientOptions | ItemLike) {
        if(ingredient == null) throw new TypeError("Ingredient cannot be null");

        let instance: CraftingIngredient;
        if(ingredient instanceof CraftingIngredient) {
            instance = ingredient;
        } else {
            let options: CraftingIngredientOptions;
            if(ingredient instanceof Item || ingredient instanceof BlockState || ingredient instanceof Identifier || typeof ingredient == "string") {
                options = { item: ingredient  };
            } else {
                options = ingredient as CraftingIngredientOptions;
            }
            instance = new CraftingIngredient(options);
        }

        this.items.set(x + " " + y, instance);
    }
    public getIngredientAt(x: number, y: number): CraftingIngredient | null {
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

    public flip(flipX: boolean, flipY: boolean) {
        return this.transform(new Matrix3().makeScale(flipX ? -1 : 1, flipY ? -1 : 1));
    }
    public translate(x: number, y: number) {
        return this.transform(new Matrix3().makeTranslation(x, y));
    }
    public rotate(angle: number) {
        return this.transform(new Matrix3().makeRotation(angle * Math.PI / 180));
    }

    private transform(matrix: Matrix3) {
        const oldItems = this.items;
        this.items = new Map;

        for(const slot of oldItems.keys()) {
            const splitSlot = slot.split(" ");
            const itemPosition = new Vector2(+splitSlot[0], +splitSlot[1]);

            itemPosition.x -= 1;
            itemPosition.y -= 1;
            itemPosition.applyMatrix3(matrix);
            itemPosition.x += 1;
            itemPosition.y += 1;
            
            this.setIngredientAt(Math.round(itemPosition.x), Math.round(itemPosition.y), oldItems.get(slot));
        }

        return this;
    }

    public serialize() {
        const inputs: Record<string, any> = {};
        const craftingSymbols: Map<string, string> = new Map;

        let itemIndex = 0;
        for(const item of this.items.values()) {
            const symbol = craftingInputSymbols[itemIndex];
            inputs[symbol] = item.serialize();
            craftingSymbols.set(item.toString(), symbol);
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
                    row[x] = craftingSymbols.get(item.toString());
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
    ingredient: CraftingIngredient;
    count: number;
}

export class ShapelessCraftingRecipe implements CraftingRecipe<SerializedShapelessCraftingRecipe> {
    private items: Set<ShapelessCraftingRecipeEntry> = new Set;
    public result: ItemLike = null;
    public resultCount: number = 1;

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
    }

    public setResult(ingredient: ItemLike, count: number = this.resultCount) {
        this.result = ingredient;
        this.resultCount = count;
    }

    public serialize(): SerializedShapelessCraftingRecipe {
        const inputs: Record<string, any>[] = new Array;

        for(const entry of this.items) {
            if(entry.ingredient.tag == null) {
                inputs.push({
                    [entry.ingredient.toString()]: entry.count
                });
            } else {
                // Bug in the game
                // inputs.push({
                //     amount: entry.count,
                //     and: [{
                //         has_tag: entry.ingredient.tag
                //     }]
                // });

                inputs.push({
                    amount: entry.count,
                    has_tag: entry.ingredient.tag
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

    public add<T>(recipe: CraftingRecipe<T>) {
        this.recipes.add(recipe);
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