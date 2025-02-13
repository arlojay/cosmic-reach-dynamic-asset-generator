"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemDropAction = exports.CycleBlockStateParamsAction = exports.SetBlockStateParamsAction = exports.ReplaceBlockStateAction = exports.RunTriggerAction = exports.TriggerAction = void 0;
class TriggerAction {
    name;
    condition;
    parameters;
    constructor(parameters) {
        this.parameters = parameters ?? null;
    }
    if(condition) {
        this.condition = condition;
        return this;
    }
    serialize() {
        const object = {
            actionId: this.name
        };
        if (this.condition != null)
            object.if = this.condition;
        if (this.parameters != null)
            object.parameters = this.parameters;
        return object;
    }
}
exports.TriggerAction = TriggerAction;
class RunTriggerAction extends TriggerAction {
    name = "base:run_trigger";
}
exports.RunTriggerAction = RunTriggerAction;
class ReplaceBlockStateAction extends TriggerAction {
    name = "base:replace_block_state";
}
exports.ReplaceBlockStateAction = ReplaceBlockStateAction;
class SetBlockStateParamsAction extends TriggerAction {
    name = "base:set_block_state_params";
}
exports.SetBlockStateParamsAction = SetBlockStateParamsAction;
class CycleBlockStateParamsAction extends TriggerAction {
    name = "base:cycle_block_state_params";
}
exports.CycleBlockStateParamsAction = CycleBlockStateParamsAction;
class ItemDropAction extends TriggerAction {
    name = "base:item_drop";
}
exports.ItemDropAction = ItemDropAction;
