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

import { ItemLike, itemLikeToString } from "./item";
import { Identifier } from "./identifier";

export interface SerializedLootTableStack {
    id: string;
    min?: number;
    max?: number;
}
export class LootTableStack {
    public min: number = null;
    public max: number = null;
    public item: ItemLike;

    constructor(item: ItemLike) {
        this.item = item;
    }

    public clone() {
        const stack = new LootTableStack(this.item);

        if(this.min != null) stack.min = this.min;
        if(this.max != null) stack.max = this.max;

        return stack;
    }

    public serialize() {
        const object: SerializedLootTableStack = {
            id: itemLikeToString(this.item)
        };

        if(this.min != null) object.min = this.min;
        if(this.max != null) object.max = this.max;

        return object;
    }
}

export type SerializedLootTableOption = SerializedLootTableStack[] | {
    weight: number;
    stacks: SerializedLootTableStack[];
};
export class LootTableOption {
    public weight: number = null;
    public stacks: Set<LootTableStack> = new Set;

    public createStack(item: ItemLike, min?: number, max?: number) {
        const stack = new LootTableStack(item);
        if(min != null) stack.min = min;
        if(max != null) stack.max = max;

        this.stacks.add(stack);

        return stack;
    }

    public clone() {
        const option = new LootTableOption;
        
        if(this.weight != null) option.weight = this.weight;

        for(const stack of this.stacks) {
            option.stacks.add(stack.clone());
        }

        return option;
    }
    
    public serialize() {
        const serializedStacks = this.stacks.values().map(s => s.serialize()).toArray();

        if(this.weight == null) {
            return serializedStacks;
        } else {
            return {
                weight: this.weight,
                stacks: serializedStacks
            };
        }
    }
}

export interface SerializedLootTable {
    id: string;
    options: SerializedLootTableOption[];
}
export class LootTable {
    public id: Identifier;
    public options: Set<LootTableOption> = new Set;

    constructor(identifier: Identifier) {
        this.id = identifier;
    }

    public createOption(weight?: number) {
        const option = new LootTableOption;
        if(weight != null) option.weight = weight;

        this.options.add(option);

        return option;
    }

    public createSingleOption(item: ItemLike, min?: number, max?: number, weight?: number) {
        const option = this.createOption(weight);
        option.createStack(item, min, max);

        return option;
    }

    public clone(id: string) {
        const table = new LootTable(this.id.derive(id));

        for(const option of this.options) {
            table.options.add(option.clone());
        }

        return table;
    }
    
    public getLootPath(): string {
        return "loot/" + this.id.getItem() + ".json";
    }
    public getLootId(): string {
        return this.id.toString();
    }

    public serialize(): SerializedLootTable {
        return {
            id: this.id.toString(),
            options: this.options.keys().map(o => o.serialize()).toArray()
        };
    }
}