"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockState = void 0;
class BlockState {
    mod;
    block;
    params = new Map;
    model;
    triggerSheet = null;
    isOpaque = true;
    lightAttenuation = null; // default 15
    canRaycastForBreak = null; // default true
    canRaycastForPlaceOn = null; // default true
    canRaycastForReplace = null; // default false
    walkThrough = null; // default false
    tags = new Array;
    stateGenerators = new Array;
    hardness = null; // default 1?
    dropId = null;
    catalogHidden = null;
    fuelTicks = null; // part of intProperties.fuelTicks for some reason
    light = null;
    swapGroupId = null;
    friction = null; // default 1?
    langKey = null;
    bounciness = null; // default 0
    canPlace = null; // TODO
    rotXZ = null; // default 0, valid: 0, 90, 180, 270
    dropParamOverrides;
    allowSwapping = null; // default true
    isFluid = null;
    itemIcon = null;
    constructor(mod, block) {
        this.mod = mod;
        this.block = block;
    }
    createBlockModel(id) {
        const model = this.mod.createBlockModel(id ?? (this.block.id.getItem() + "•" + this.compileParams().replace(/\=/g, "_").replace(/\,/g, "-")));
        this.model = model;
        return model;
    }
    setBlockModel(model) {
        this.model = model;
    }
    createTriggerSheet(id) {
        const triggerSheet = this.mod.createTriggerSheet(id ??
            (this.block.id.getItem() + "•" + this.compileParams().replace(/\=/g, "_").replace(/\,/g, "-")));
        this.triggerSheet = triggerSheet;
        return triggerSheet;
    }
    setTriggerSheet(triggerSheet) {
        this.triggerSheet = triggerSheet;
    }
    compileParams() {
        return Array.from(this.params).map(v => {
            if (v[1] == null || v[1].length == 0)
                return v[0];
            return v.join("=");
        }).join(",");
    }
    serialize() {
        const object = {
            modelName: this.model.getBlockModelId().toString()
        };
        if (this.rotXZ != null)
            object.rotXZ = this.rotXZ;
        if (this.triggerSheet != null)
            object.blockEventsId = this.triggerSheet.getTriggerSheetId().toString();
        if (this.canPlace != null)
            object.canPlace = this.canPlace;
        if (this.fuelTicks != null)
            object.intProperties = {
                fuelTicks: this.fuelTicks
            };
        if (this.canRaycastForBreak != null)
            object.canRaycastForBreak = this.canRaycastForBreak;
        if (this.canRaycastForPlaceOn != null)
            object.canRaycastForPlaceOn = this.canRaycastForPlaceOn;
        if (this.canRaycastForReplace != null)
            object.canRaycastForReplace = this.canRaycastForReplace;
        if (this.isFluid != null)
            object.isFluid = this.isFluid;
        if (this.walkThrough != null)
            object.walkThrough = this.walkThrough;
        if (this.isOpaque != null)
            object.isOpaque = this.isOpaque;
        if (this.tags != null && this.tags.length > 0)
            object.tags = this.tags;
        if (this.stateGenerators != null && this.stateGenerators.length > 0)
            object.stateGenerators = this.stateGenerators;
        if (this.dropId != null)
            object.dropId = this.dropId.getFullId();
        if (this.dropParamOverrides != null)
            object.dropParamOverrides = this.dropParamOverrides;
        if (this.swapGroupId != null)
            object.swapGroupId = this.swapGroupId.toString();
        if (this.allowSwapping != null)
            object.allowSwapping = this.allowSwapping;
        if (this.catalogHidden != null)
            object.catalogHidden = this.catalogHidden;
        if (this.itemIcon != null)
            object.itemIcon = this.itemIcon.getAsItemTextureId(this.mod).toString();
        if (this.light != null) {
            object.lightLevelRed = this.light[0];
            object.lightLevelGreen = this.light[1];
            object.lightLevelBlue = this.light[2];
        }
        if (this.lightAttenuation != null)
            object.lightAttenuation = this.lightAttenuation;
        if (this.friction != null)
            object.friction = this.friction;
        if (this.bounciness != null)
            object.bounciness = this.bounciness;
        if (this.hardness != null)
            object.hardness = this.hardness;
        if (this.langKey != null)
            object.langKey = this.langKey;
        return object;
    }
    getFullId() {
        return this.block.getBlockId() + "[" + this.compileParams() + "]";
    }
}
exports.BlockState = BlockState;
//# sourceMappingURL=blockState.js.map