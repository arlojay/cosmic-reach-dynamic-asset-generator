"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CraftingRecipeList = exports.ShapelessCraftingRecipe = exports.ShapedCraftingRecipe = exports.CraftingIngredient = void 0;
const three_1 = require("three");
const crafting_1 = require("./crafting");
const identifier_1 = require("./identifier");
const item_1 = require("./item");
const blockState_1 = require("./blockState");
const craftingInputSymbols = "ABCDEFGHI";
class CraftingIngredient {
    item = null;
    tag = null;
    constructor(options) {
        if (options.item != null)
            this.item = options.item;
        if (options.tag != null)
            this.tag = options.tag;
    }
    serialize() {
        if (this.tag != null)
            return { has_tag: this.tag };
        return (0, crafting_1.itemLikeToString)(this.item);
    }
    toString() {
        if (this.item != null)
            return (0, crafting_1.itemLikeToString)(this.item);
        if (this.tag != null)
            return "::" + this.tag;
        throw new ReferenceError("Ingredient must have an `item` or `tag`", { cause: this });
    }
}
exports.CraftingIngredient = CraftingIngredient;
class ShapedCraftingRecipe {
    items = new Map;
    result = null;
    resultCount = 1;
    setIngredientAt(x, y, ingredient) {
        if (ingredient == null)
            throw new TypeError("Ingredient cannot be null");
        let instance;
        if (ingredient instanceof CraftingIngredient) {
            instance = ingredient;
        }
        else {
            let options;
            if (ingredient instanceof item_1.Item || ingredient instanceof blockState_1.BlockState || ingredient instanceof identifier_1.Identifier || typeof ingredient == "string") {
                options = { item: ingredient };
            }
            else {
                options = ingredient;
            }
            instance = new CraftingIngredient(options);
        }
        this.items.set(x + " " + y, instance);
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
    flip(flipX, flipY) {
        return this.transform(new three_1.Matrix3().makeScale(flipX ? -1 : 1, flipY ? -1 : 1));
    }
    translate(x, y) {
        return this.transform(new three_1.Matrix3().makeTranslation(x, y));
    }
    rotate(angle) {
        return this.transform(new three_1.Matrix3().makeRotation(angle * Math.PI / 180));
    }
    transform(matrix) {
        const oldItems = this.items;
        this.items = new Map;
        for (const slot of oldItems.keys()) {
            const splitSlot = slot.split(" ");
            const itemPosition = new three_1.Vector2(+splitSlot[0], +splitSlot[1]);
            itemPosition.x -= 1;
            itemPosition.y -= 1;
            itemPosition.applyMatrix3(matrix);
            itemPosition.x += 1;
            itemPosition.y += 1;
            this.setIngredientAt(Math.round(itemPosition.x), Math.round(itemPosition.y), oldItems.get(slot));
        }
        return this;
    }
    serialize() {
        const inputs = {};
        const craftingSymbols = new Map;
        let itemIndex = 0;
        for (const item of this.items.values()) {
            const symbol = craftingInputSymbols[itemIndex];
            inputs[symbol] = item.serialize();
            craftingSymbols.set(item.toString(), symbol);
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
                    row[x] = craftingSymbols.get(item.toString());
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
        if (item == null)
            throw new TypeError("Ingredient cannot be null");
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
    add(recipe) {
        this.recipes.add(recipe);
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
