/*
Copyright 2025 arlojay

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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