"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomAction = exports.SetSphericalSegment = exports.SetSphereAction = exports.SetCuboidAction = exports.CopyBlockStateParamsAction = exports.IncrementParamAction = exports.CycleBlockStateParamsAction = exports.SetBlockStateParamsAction = exports.ReplaceBlockStateAction = exports.LootDropAction = exports.ItemDropAction = exports.LeafDecayAction = exports.GrowTreePoplarAction = exports.GrowTreeCoconutAction = exports.ExplodeAction = exports.PlaySound3DAction = exports.PlaySound2DAction = exports.BlockEntitySignalAction = exports.RunTriggerAction = exports.TriggerAction = void 0;
const three_1 = require("three");
const crafting_1 = require("./crafting");
const sound_1 = require("./sound");
const identifier_1 = require("./identifier");
class TriggerAction {
    mod;
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
    modifyParams(params) {
    }
    serialize(mod) {
        this.mod = mod;
        const object = {
            actionId: this.name
        };
        if (this.condition != null)
            object.if = this.condition;
        if (this.parameters != null) {
            const shallowParameterClone = Object.assign({}, this.parameters);
            this.modifyParams(shallowParameterClone);
            object.parameters = shallowParameterClone;
        }
        return object;
    }
}
exports.TriggerAction = TriggerAction;
class RunTriggerAction extends TriggerAction {
    name = "base:run_trigger";
}
exports.RunTriggerAction = RunTriggerAction;
class BlockEntitySignalAction extends TriggerAction {
    name = "base:block_entity_signal";
}
exports.BlockEntitySignalAction = BlockEntitySignalAction;
class PlaySound2DAction extends TriggerAction {
    name = "base:play_sound_2d";
    modifyParams(params) {
        if (params.sound != null) {
            if (params.sound instanceof sound_1.Sound)
                params.sound = params.sound.getAsBlockSoundId(this.mod);
            if (params.sound instanceof identifier_1.Identifier)
                params.sound = params.sound.derive("sounds/blocks/" + params.sound.getItem() + ".ogg").toString();
        }
    }
}
exports.PlaySound2DAction = PlaySound2DAction;
class PlaySound3DAction extends TriggerAction {
    name = "base:play_sound_3d";
    modifyParams(params) {
        if (params.sound != null) {
            if (params.sound instanceof sound_1.Sound)
                params.sound = params.sound.getAsBlockSoundId(this.mod);
            else if (params.sound instanceof identifier_1.Identifier)
                params.sound = params.sound.toString();
        }
    }
}
exports.PlaySound3DAction = PlaySound3DAction;
class ExplodeAction extends TriggerAction {
    name = "base:explode";
    modifyParams(params) {
        if (params.blockState != null)
            params.blockStateId = (0, crafting_1.itemLikeToString)(params.blockState);
        delete params.blockState;
    }
}
exports.ExplodeAction = ExplodeAction;
class GrowTreeCoconutAction extends TriggerAction {
    name = "base:grow_tree_coconut";
}
exports.GrowTreeCoconutAction = GrowTreeCoconutAction;
class GrowTreePoplarAction extends TriggerAction {
    name = "base:grow_tree_poplar";
}
exports.GrowTreePoplarAction = GrowTreePoplarAction;
class LeafDecayAction extends TriggerAction {
    name = "base:leaf_decay";
}
exports.LeafDecayAction = LeafDecayAction;
class ItemDropAction extends TriggerAction {
    name = "base:item_drop";
    modifyParams(params) {
        if (params.item != null)
            params.dropId = (0, crafting_1.itemLikeToString)(params.item);
    }
}
exports.ItemDropAction = ItemDropAction;
class LootDropAction extends TriggerAction {
    name = "base:loot_drop";
}
exports.LootDropAction = LootDropAction;
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
class IncrementParamAction extends TriggerAction {
    name = "base:increment_param";
}
exports.IncrementParamAction = IncrementParamAction;
class CopyBlockStateParamsAction extends TriggerAction {
    name = "base:copy_block_state_params";
}
exports.CopyBlockStateParamsAction = CopyBlockStateParamsAction;
class SetCuboidAction extends TriggerAction {
    name = "base:set_cuboid";
    modifyParams(params) {
        if (params.block != null)
            params.blockStateId = (0, crafting_1.itemLikeToString)(params.block);
    }
}
exports.SetCuboidAction = SetCuboidAction;
class SetSphereAction extends TriggerAction {
    name = "base:set_sphere";
    modifyParams(params) {
        if (params.block != null)
            params.blockStateId = (0, crafting_1.itemLikeToString)(params.block);
    }
}
exports.SetSphereAction = SetSphereAction;
class SetSphericalSegment extends TriggerAction {
    name = "base:set_spherical_segment";
    modifyParams(params) {
        if (params.block != null)
            params.blockStateId = (0, crafting_1.itemLikeToString)(params.block);
        [params.xNormal, params.yNormal, params.zNormal] = new three_1.Vector3(params.xNormal, params.yNormal, params.zNormal).normalize().toArray();
    }
}
exports.SetSphericalSegment = SetSphericalSegment;
class CustomAction extends TriggerAction {
    constructor(name, params) {
        super(params);
        this.name = name;
    }
}
exports.CustomAction = CustomAction;
