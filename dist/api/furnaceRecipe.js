"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FurnaceRecipeList = exports.FurnaceRecipe = void 0;
const crafting_1 = require("./crafting");
class FurnaceRecipe {
    input = null;
    output = null;
    setInput(item) {
        this.input = item;
    }
    setOutput(item) {
        this.output = item;
    }
    addToList(list) {
        list[(0, crafting_1.itemLikeToString)(this.input)] = (0, crafting_1.itemLikeToString)(this.output);
    }
}
exports.FurnaceRecipe = FurnaceRecipe;
class FurnaceRecipeList {
    id;
    recipes = new Set;
    constructor(id) {
        this.id = id;
    }
    createRecipe(input, output) {
        const recipe = new FurnaceRecipe;
        recipe.setInput(input);
        recipe.setOutput(output);
        this.addRecipe(recipe);
        return recipe;
    }
    addRecipe(recipe) {
        this.recipes.add(recipe);
    }
    serialize() {
        const object = {};
        for (const recipe of this.recipes)
            recipe.addToList(object);
        return object;
    }
    getRecipePath() {
        return "recipes/furnace/" + this.id.getItem() + ".json";
    }
}
exports.FurnaceRecipeList = FurnaceRecipeList;
