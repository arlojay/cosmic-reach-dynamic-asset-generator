"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CraftingRecipeList = exports.ShapelessCraftingRecipe = exports.ShapedCraftingRecipe = void 0;
const crafting_1 = require("./crafting");
const craftingInputSymbols = "ABCDEFGHI";
class ShapedCraftingRecipe {
    items = new Map;
    result = null;
    resultCount = 1;
    setIngredientAt(x, y, ingredient) {
        this.items.set(x + " " + y, ingredient);
    }
    getIngredientAt(x, y) {
        return this.items.get(x + " " + y) ?? null;
    }
    setResult(ingredient, count) {
        this.result = ingredient;
        this.resultCount = count;
    }
    clone() {
        const recipe = new ShapedCraftingRecipe;
        for (const slot of this.items.keys()) {
            recipe.items.set(slot, this.items.get(slot));
        }
        recipe.result = this.result;
        recipe.resultCount = this.resultCount;
        return recipe;
    }
    serialize() {
        const itemTypes = new Set;
        for (const item of this.items.values()) {
            itemTypes.add((0, crafting_1.itemLikeToString)(item));
        }
        const inputs = {};
        const craftingSymbols = new Map;
        let itemIndex = 0;
        for (const item of itemTypes) {
            const symbol = craftingInputSymbols[itemIndex];
            inputs[symbol] = item;
            craftingSymbols.set(item, symbol);
            itemIndex++;
        }
        const pattern = ["   ", "   ", "   "];
        for (let y = 0; y < 3; y++) {
            const row = new Array(3);
            for (let x = 0; x < 3; x++) {
                const item = this.getIngredientAt(x, y);
                if (item == null) {
                    row[x] = " ";
                }
                else {
                    row[x] = craftingSymbols.get((0, crafting_1.itemLikeToString)(item));
                }
            }
            pattern[y] = row.join("");
        }
        const object = {
            pattern, inputs,
            output: {
                item: (0, crafting_1.itemLikeToString)(this.result),
                amount: this.resultCount
            }
        };
        return object;
    }
}
exports.ShapedCraftingRecipe = ShapedCraftingRecipe;
class ShapelessCraftingRecipe {
    items = new Set;
    result = null;
    resultCount = 1;
    addItem(item, count = 1) {
        this.items.add({ item, count });
    }
    setResult(ingredient, count = this.resultCount) {
        this.result = ingredient;
        this.resultCount = count;
    }
    serialize() {
        const inputs = new Array;
        for (const entry of this.items) {
            inputs.push({ [(0, crafting_1.itemLikeToString)(entry.item)]: entry.count });
        }
        return {
            inputs,
            output: {
                item: (0, crafting_1.itemLikeToString)(this.result),
                amount: this.resultCount
            }
        };
    }
}
exports.ShapelessCraftingRecipe = ShapelessCraftingRecipe;
class CraftingRecipeList {
    id;
    recipes = new Set;
    constructor(id) {
        this.id = id;
    }
    createShaped(output, outputCount = 1) {
        const recipe = new ShapedCraftingRecipe();
        recipe.setResult(output, outputCount);
        this.recipes.add(recipe);
        return recipe;
    }
    createShapeless(output, outputCount = 1) {
        const recipe = new ShapelessCraftingRecipe();
        recipe.setResult(output, outputCount);
        this.recipes.add(recipe);
        return recipe;
    }
    serialize() {
        const object = {
            recipes: Array.from(this.recipes).map(recipe => recipe.serialize())
        };
        return object;
    }
    getRecipePath() {
        return "recipes/crafting/" + this.id.getItem() + ".json";
    }
}
exports.CraftingRecipeList = CraftingRecipeList;
