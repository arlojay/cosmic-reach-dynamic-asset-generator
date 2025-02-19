"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crafting = void 0;
exports.itemLikeToString = itemLikeToString;
const blockState_1 = require("./blockState");
const craftingRecipe_1 = require("./craftingRecipe");
const furnaceRecipe_1 = require("./furnaceRecipe");
const identifier_1 = require("./identifier");
const item_1 = require("./item");
function itemLikeToString(item) {
    if (item instanceof item_1.Item)
        return item.id.toString();
    if (item instanceof blockState_1.BlockState)
        return item.getFullId();
    return item.toString();
}
class Crafting {
    mod;
    craftingRecipes = new Set;
    furnaceRecipes = new Set;
    constructor(mod) {
        this.mod = mod;
    }
    createCraftingRecipe(id) {
        const list = new craftingRecipe_1.CraftingRecipeList(new identifier_1.Identifier(this.mod, id));
        this.craftingRecipes.add(list);
        return list;
    }
    createFurnaceRecipe(id) {
        const list = new furnaceRecipe_1.FurnaceRecipeList(new identifier_1.Identifier(this.mod, id));
        this.furnaceRecipes.add(list);
        return list;
    }
}
exports.Crafting = Crafting;
