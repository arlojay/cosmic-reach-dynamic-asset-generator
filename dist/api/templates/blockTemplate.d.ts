import { Block } from "../block";
import { BlockModel } from "../blockModel";
import { BlockState } from "../blockState";
import { Identifier } from "../identifier";
import { LangKey } from "../lang";
import { Mod } from "../mod";
import { Sound } from "../sound";
export declare abstract class BasicBlock {
    protected abstract id: string;
    protected isOpaque: boolean;
    protected hardness: number;
    protected block: Block;
    protected defaultState: BlockState;
    create(mod: Mod): Promise<void>;
    protected abstract addTranslations(langKey: LangKey): void;
    protected abstract overrideTextures(model: BlockModel): Promise<void>;
    protected getDropItem(): BlockState;
    protected getBreakSound(): Promise<Sound | Identifier | string>;
    protected getPlaceSound(): Promise<Sound | Identifier | string>;
}
