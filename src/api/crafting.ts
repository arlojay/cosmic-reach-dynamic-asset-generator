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

import { BasicCraftingRecipe } from "./basicCraftingRecipe";
import { FurnaceRecipeList } from "./furnaceRecipe";
import { Identifier } from "./identifier";
import { ItemLike } from "./item";
import { Mod } from "./mod";

export class Crafting {
    private mod: Mod;
    public craftingRecipes: Set<BasicCraftingRecipe> = new Set;
    public furnaceRecipes: Set<FurnaceRecipeList> = new Set;

    public constructor(mod: Mod) {
        this.mod = mod;
    }

    public createCraftingRecipe(id: string, result: ItemLike, amount?: number): BasicCraftingRecipe {
        const recipe = new BasicCraftingRecipe(new Identifier(this.mod, id));
        recipe.setResult(result, amount);

        this.craftingRecipes.add(recipe);
        return recipe;
    }

    public createFurnaceRecipe(id: string): FurnaceRecipeList {
        const list = new FurnaceRecipeList(new Identifier(this.mod, id));

        this.furnaceRecipes.add(list);
        return list;
    }
}