"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicBlock = void 0;
const identifier_1 = require("../identifier");
const triggerActions_1 = require("../triggerActions");
class BasicBlock {
    isOpaque = false;
    hardness = null;
    block;
    defaultState;
    async create(mod) {
        const block = mod.createBlock(this.id);
        this.block = block;
        this.addTranslations(block.createDefaultLangKey());
        const state = block.createState("default");
        this.defaultState = state;
        state.dropState = this.getDropItem();
        state.isOpaque = this.isOpaque;
        if (this.hardness != null)
            state.hardness = this.hardness;
        const model = state.createBlockModel(this.id);
        model.setParent(new identifier_1.Identifier("base", "cube"));
        model.transparent = !this.isOpaque;
        await this.overrideTextures(model);
        const triggerSheet = state.createTriggerSheet(this.id);
        triggerSheet.setParent(new identifier_1.Identifier("base", "block_events_default"));
        triggerSheet.addTrigger("relayPlayBreakSound", new triggerActions_1.PlaySound2DAction({
            sound: await this.getBreakSound(),
            pitch: [0.9, 1.1]
        }));
        triggerSheet.addTrigger("relayPlayPlaceSound", new triggerActions_1.PlaySound2DAction({
            sound: await this.getPlaceSound(),
            pitch: [0.9, 1.1]
        }));
    }
    getDropItem() {
        return this.defaultState;
    }
    async getBreakSound() {
        return new identifier_1.Identifier("base", "block-break");
    }
    async getPlaceSound() {
        return new identifier_1.Identifier("base", "block-place");
    }
}
exports.BasicBlock = BasicBlock;
