import { Identifier } from "./identifier";
import { BlockEntitySignalAction } from "./triggerActions";
export declare abstract class BlockEntity<T> {
    abstract id: Identifier;
    serialize(): T;
}
export declare class LaserEmitterBlockEntity extends BlockEntity<{}> {
    id: Identifier;
    shoot(): BlockEntitySignalAction;
}
export declare class ContainerBlockEntity extends BlockEntity<{
    numSlots: number;
}> {
    id: Identifier;
    slotCount: number;
    constructor(slotCount: number);
    serialize(): {
        numSlots: number;
    };
}
export declare class FurnaceBlockEntity extends BlockEntity<{}> {
    id: Identifier;
}
export declare class SignBlockEntity extends BlockEntity<{}> {
    id: Identifier;
}
