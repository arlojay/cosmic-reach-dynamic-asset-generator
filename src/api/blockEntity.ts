import { Identifier } from "./identifier";
import { BlockEntitySignalAction } from "./triggerActions";

export abstract class BlockEntity<T> {
    public abstract id: Identifier;

    public serialize(): T {
        return null;
    }
}

export class LaserEmitterBlockEntity extends BlockEntity<{}> {
    public id = new Identifier("base", "laser_emitter");

    public shoot() {
        return new BlockEntitySignalAction({ signal: "shootProjectile" });
    }
}
export class ContainerBlockEntity extends BlockEntity<{ numSlots: number }> {
    public id = new Identifier("base", "container");
    public slotCount: number;

    public constructor(slotCount: number) {
        super();
        this.slotCount = slotCount;
    }

    public serialize() {
        return {
            numSlots: this.slotCount
        }
    }
}
export class FurnaceBlockEntity extends BlockEntity<{}> {
    public id = new Identifier("base", "furnace");
}
export class SignBlockEntity extends BlockEntity<{}> {
    public id = new Identifier("base", "sign_entity");
}