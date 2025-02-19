"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mod = void 0;
const block_1 = require("./block");
const blockModel_1 = require("./blockModel");
const crafting_1 = require("./crafting");
const identifier_1 = require("./identifier");
const item_1 = require("./item");
const lang_1 = require("./lang");
const triggerSheet_1 = require("./triggerSheet");
class Mod {
    id;
    blocks = new Set;
    blockModels = new Set;
    triggerSheets = new Set;
    items = new Set;
    langMap = new lang_1.LangMap(this);
    crafting = new crafting_1.Crafting(this);
    constructor(id) {
        this.id = id;
    }
    createBlock(id) {
        const block = new block_1.Block(this, new identifier_1.Identifier(this, id));
        this.blocks.add(block);
        return block;
    }
    createBlockModel(id) {
        const blockModel = new blockModel_1.BlockModel(this, new identifier_1.Identifier(this, id));
        this.blockModels.add(blockModel);
        return blockModel;
    }
    createTriggerSheet(id) {
        const triggerSheet = new triggerSheet_1.TriggerSheet(this, new identifier_1.Identifier(this, id));
        this.triggerSheets.add(triggerSheet);
        return triggerSheet;
    }
    createItem(id) {
        const item = new item_1.Item(this, new identifier_1.Identifier(this, id));
        this.items.add(item);
        return item;
    }
    createCraftingRecipe(id) {
        return this.crafting.createCraftingRecipe(id);
    }
    createFurnaceRecipe(id) {
        return this.crafting.createFurnaceRecipe(id);
    }
}
exports.Mod = Mod;
