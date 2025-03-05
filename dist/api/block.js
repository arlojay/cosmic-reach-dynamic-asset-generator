"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = void 0;
const blockState_1 = require("./blockState");
class Block {
    id;
    mod;
    properties;
    fallbackParams = {};
    blockStates = new Set;
    blockEntity = null;
    defaultLangKey = null;
    constructor(mod, id) {
        this.id = id;
        this.mod = mod;
    }
    createState(blockStateString) {
        const blockState = new blockState_1.BlockState(this.mod, this);
        this.blockStates.add(blockState);
        if (blockStateString != null) {
            if (blockStateString instanceof Map) {
                for (const [key, value] of blockStateString) {
                    blockState.params.set(key, value);
                }
            }
            else if (typeof blockStateString == "object") {
                for (const [key, value] of Object.entries(blockStateString)) {
                    blockState.params.set(key, value);
                }
            }
            else if (typeof blockStateString == "string") {
                for (const pair of blockStateString.split(",")) {
                    const [key, value] = pair.split("=");
                    blockState.params.set(key, value);
                }
            }
        }
        if (this.defaultLangKey != null) {
            blockState.setLangKey(this.defaultLangKey);
        }
        return blockState;
    }
    setBlockEntity(blockEntity) {
        this.blockEntity = blockEntity;
    }
    getStates() {
        return new Set(this.blockStates);
    }
    createDefaultLangKey() {
        const key = this.mod.langMap.createBlockKey(this.id.getItem());
        this.defaultLangKey = key;
        return key;
    }
    setDefaultLangKey(langKey) {
        this.defaultLangKey = langKey;
    }
    serialize() {
        const blockStates = {};
        for (const blockState of this.blockStates) {
            const blockStateId = blockState.compileParams();
            if (blockStateId in blockStates)
                throw new ReferenceError("Duplicate block state " + blockStateId);
            blockStates[blockStateId] = blockState.serialize();
        }
        const object = {
            stringId: this.id.toString(),
            blockStates
        };
        if (this.fallbackParams != null && Object.keys(this.fallbackParams).length > 0)
            object.defaultProperties = this.fallbackParams;
        if (this.blockEntity != null) {
            object.blockEntityId = this.blockEntity.id.toString();
            object.blockEntityParams = this.blockEntity.serialize();
        }
        return object;
    }
    getBlockPath() {
        return "blocks/" + this.id.getItem() + ".json";
    }
    getBlockId() {
        return this.id.toString();
    }
}
exports.Block = Block;
