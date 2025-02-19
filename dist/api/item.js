"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
class Item {
    mod;
    id;
    langKey;
    texture;
    modelType = "base:item3D";
    stackLimit = null; // default 1000
    toolSpeed = null;
    durability = null;
    effectiveBreakingTags = new Array;
    bounciness = null;
    fuelTicks = null;
    constructor(mod, id) {
        this.mod = mod;
        this.id = id;
    }
    createLangKey() {
        this.langKey = this.mod.langMap.createItemKey(this.id.getItem());
        return this.langKey;
    }
    setLangKey(key) {
        this.langKey = key;
    }
    serialize() {
        const object = {
            id: this.id.toString(),
            itemProperties: {
                texture: this.texture.getAsItemTextureId(this.mod).toString(),
                modelType: this.modelType
            }
        };
        if (this.stackLimit != null)
            object.itemProperties.stackLimit = this.stackLimit;
        if (this.toolSpeed != null)
            object.itemProperties.toolSpeed = this.toolSpeed;
        if (this.durability != null)
            object.itemProperties.durability = this.durability;
        if (this.effectiveBreakingTags.length > 0)
            object.itemProperties.effectiveBreakingTags = this.effectiveBreakingTags;
        if (this.bounciness != null)
            object.itemProperties.bounciness = this.bounciness;
        if (this.fuelTicks != null)
            object.itemProperties.fuelTicks = this.fuelTicks;
        return object;
    }
    getItemPath() {
        return "items/" + this.id.getItem() + ".json";
    }
    getItemId() {
        return this.id.toString();
    }
}
exports.Item = Item;
