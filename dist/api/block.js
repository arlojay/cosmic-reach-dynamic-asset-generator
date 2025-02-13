"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = void 0;
const blockState_1 = require("./blockState");
class Block {
    id;
    mod;
    properties;
    defaultState = null;
    fallbackParams = null;
    blockStates = new Set;
    blockEntity = null;
    constructor(mod, id) {
        this.id = id;
        this.mod = mod;
    }
    createState(blockStateString) {
        const blockState = new blockState_1.BlockState(this.mod, this);
        if (this.defaultState == null)
            this.defaultState = blockState;
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
        return blockState;
    }
    createBlockEntity() {
        throw new Error("Method not implemented");
    }
    getStates() {
        return new Set(this.blockStates);
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
        if (this.fallbackParams != null)
            object.defaultProperties = this.fallbackParams.serialize();
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
