import { Identifier } from "./identifier";
import { Mod } from "./mod";
import { Audio } from "./audio";
export declare class Sound {
    id: string;
    audio: Audio | string | Identifier;
    static loadFromFile(id: string, fullPath: string): Promise<Sound>;
    constructor(id: string, audio: Audio | string | Identifier);
    getAudio(): Audio;
    getAsBlockSoundPath(): string;
    getAsBlockSoundId(mod: Mod): Identifier;
    getAsItemSoundPath(): string;
    getAsItemSoundId(mod: Mod): Identifier;
    getAsEntitySoundPath(): string;
    getAsEntitySoundId(mod: Mod): Identifier;
    getAsUISoundPath(): string;
    getAsUISoundId(mod: Mod): Identifier;
    createOggStream(): import("stream").PassThrough;
}
