"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignBlockEntity = exports.FurnaceBlockEntity = exports.ContainerBlockEntity = exports.LaserEmitterBlockEntity = exports.BlockEntity = void 0;
const identifier_1 = require("./identifier");
const triggerActions_1 = require("./triggerActions");
class BlockEntity {
    serialize() {
        return null;
    }
}
exports.BlockEntity = BlockEntity;
class LaserEmitterBlockEntity extends BlockEntity {
    id = new identifier_1.Identifier("base", "laser_emitter");
    shoot() {
        return new triggerActions_1.BlockEntitySignalAction({ signal: "shootProjectile" });
    }
}
exports.LaserEmitterBlockEntity = LaserEmitterBlockEntity;
class ContainerBlockEntity extends BlockEntity {
    id = new identifier_1.Identifier("base", "container");
    slotCount;
    constructor(slotCount) {
        super();
        this.slotCount = slotCount;
    }
    serialize() {
        return {
            numSlots: this.slotCount
        };
    }
}
exports.ContainerBlockEntity = ContainerBlockEntity;
class FurnaceBlockEntity extends BlockEntity {
    id = new identifier_1.Identifier("base", "furnace");
}
exports.FurnaceBlockEntity = FurnaceBlockEntity;
class SignBlockEntity extends BlockEntity {
    id = new identifier_1.Identifier("base", "sign_entity");
}
exports.SignBlockEntity = SignBlockEntity;
