import { describe } from "node:test";
import { Mod, Texture } from "cosmic-reach-dag";

describe("Mod creation", async (t) => {
    const mod = new Mod("test");

    await t.describe("Basic block creation", async () => {
        const block = mod.createBlock("block_basic");
        const state = block.createState("default");
        const model = state.createBlockModel();

        model.setParent(new Identifier("base", "cube"));
        model.addTextureOverride(await Texture.loadFromFile("block_basic", "./assets/block_basic.png"), "all");
    });
})