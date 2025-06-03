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

import { Block } from "./block";
import { BlockEntity } from "./blockEntity";
import { BlockModel } from "./blockModel";
import { BlockStateGenerator } from "./blockStateGenerator";
import { Crafting } from "./crafting";
import { Identifier } from "./identifier";
import { Item, ItemLike } from "./item";
import { LangMap } from "./lang";
import { LootTable } from "./loot";
import { TriggerSheet } from "./triggerSheet";

export class Mod {
    public id: string;
    public blocks: Set<Block<any>> = new Set;
    public blockModels: Set<BlockModel> = new Set;
    public triggerSheets: Set<TriggerSheet> = new Set;
    public blockStateGenerators: Set<BlockStateGenerator> = new Set;
    public items: Set<Item> = new Set;
    public langMap: LangMap = new LangMap(this);
    public crafting: Crafting = new Crafting(this);

    constructor(id: string) {
        this.id = id;
    }

    public createBlock<BlockEntityType extends BlockEntity<any> = never>(id: string): Block<BlockEntityType> {
        const block = new Block<BlockEntityType>(this, new Identifier(this, id));

        this.blocks.add(block);

        return block;
    }

    public createBlockModel(id: string): BlockModel {
        const blockModel = new BlockModel(this, new Identifier(this, id));

        this.blockModels.add(blockModel);

        return blockModel;
    }

    public createTriggerSheet(id: string): TriggerSheet {
        const triggerSheet = new TriggerSheet(this, new Identifier(this, id));

        this.triggerSheets.add(triggerSheet);

        return triggerSheet;
    }

    public createBlockStateGenerator(id: string) {
        const blockStateGenerator = new BlockStateGenerator(new Identifier(this, id));

        this.blockStateGenerators.add(blockStateGenerator);

        return blockStateGenerator;
    }

    public createItem(id: string): Item {
        const item = new Item(this, new Identifier(this, id));

        this.items.add(item);

        return item;
    }

    public createLootTable(id: string) {
        const lootTable = new LootTable(new Identifier(this, id));

        return lootTable;
    }

    public createCraftingRecipe(id: string, result: ItemLike, amount?: number) {
        return this.crafting.createCraftingRecipe(id, result, amount);
    }
    public createFurnaceRecipe(id: string) {
        return this.crafting.createFurnaceRecipe(id);
    }
}