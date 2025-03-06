import { Block } from "../block";
import { BlockModel } from "../blockModel";
import { BlockState } from "../blockState";
import { ItemLike } from "../crafting";
import { Identifier } from "../identifier";
import { LangKey } from "../lang";
import { Mod } from "../mod";
import { Sound } from "../sound";
import { PlaySound2DAction } from "../triggerActions";

export abstract class BasicBlock {
    protected abstract id: string;
    protected isOpaque: boolean = false;
    protected lightAttenuation: number = this.isOpaque ? 15 : 0;
    protected cullsSelf: boolean = null;
    protected hardness: number = null;
    protected refractiveIndex: number = null;

    protected seamless: boolean = false;
    protected createSlabs: boolean = false;
    protected createStairs: boolean = false;

    public block: Block;
    public defaultState: BlockState;

    public async create(mod: Mod) {
        const block = mod.createBlock(this.id);
        this.block = block;
        this.addTranslations(block.createDefaultLangKey());

        const state = block.createState("default");
        this.defaultState = state;
        state.dropState = this.getDropItem();
        state.isOpaque = this.isOpaque;

        if(this.hardness != null) state.hardness = this.hardness;

        state.lightAttenuation = this.lightAttenuation;
        if(this.refractiveIndex != null) state.refractiveIndex = this.refractiveIndex;

        const model = state.createBlockModel(this.id);
        model.setParent(new Identifier("base", "cube"));
        model.transparent = !this.isOpaque;
        if(this.cullsSelf != null) model.cullsSelf = this.cullsSelf;
        await this.overrideTextures(model);

        const triggerSheet = state.createTriggerSheet(this.id);
        triggerSheet.setParent(new Identifier("base", "block_events_default"));
        triggerSheet.addTrigger("relayPlayBreakSound", new PlaySound2DAction({
            sound: await this.getBreakSound(),
            pitch: [ 0.9, 1.1 ]
        }));
        triggerSheet.addTrigger("relayPlayPlaceSound", new PlaySound2DAction({
            sound: await this.getPlaceSound(),
            pitch: [ 0.9, 1.1 ]
        }));
    }

    protected abstract addTranslations(langKey: LangKey): void;
    protected abstract overrideTextures(model: BlockModel): Promise<void>;
    protected getDropItem(): BlockState {
        return this.defaultState;
    }
    protected async getBreakSound(): Promise<Sound | Identifier | string> {
        return new Identifier("base", "block-break")
    }
    protected async getPlaceSound(): Promise<Sound | Identifier | string> {
        return new Identifier("base", "block-place")
    }
}