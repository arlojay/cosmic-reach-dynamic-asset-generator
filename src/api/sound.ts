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

import { readFileSync } from "fs";
import { Identifier } from "./identifier";
import { Mod } from "./mod";
import { Audio } from "./audio";

export class Sound {
    public id: string;
    public audio: Audio | string | Identifier = null;

    public static async loadFromFile(id: string, fullPath: string) {
        const data = readFileSync(fullPath);
        
        return new Sound(id, await Audio.fromFile(data));
    }

    constructor(id: string, audio: Audio | string | Identifier) {
        this.id = id;
        if(audio != null) this.audio = audio;
    }

    public getAudio(): Audio {
        if(this.audio instanceof Audio) return this.audio;
        return null;
    }

    public getAsBlockSoundPath(): string {
        return "sounds/blocks/" + this.id + ".ogg";
    }
    public getAsBlockSoundId(mod: Mod): Identifier {
        if(this.audio != null && !(this.audio instanceof Audio)) {
            return this.audio instanceof Identifier ? this.audio : Identifier.fromId(this.audio);
        }
        return new Identifier(mod, "sounds/blocks/" + this.id + ".ogg");
    }
    public getAsItemSoundPath(): string {
        return "sounds/items/" + this.id + ".ogg";
    }
    public getAsItemSoundId(mod: Mod): Identifier {
        if(this.audio != null && !(this.audio instanceof Audio)) {
            return this.audio instanceof Identifier ? this.audio : Identifier.fromId(this.audio);
        }
        return new Identifier(mod, "sounds/items/" + this.id + ".ogg");
    }
    public getAsEntitySoundPath(): string {
        return "sounds/entities/" + this.id + ".ogg";
    }
    public getAsEntitySoundId(mod: Mod): Identifier {
        if(this.audio != null && !(this.audio instanceof Audio)) {
            return this.audio instanceof Identifier ? this.audio : Identifier.fromId(this.audio);
        }
        return new Identifier(mod, "sounds/entities/" + this.id + ".ogg");
    }
    public getAsUISoundPath(): string {
        return "sounds/ui/" + this.id + ".ogg";
    }
    public getAsUISoundId(mod: Mod): Identifier {
        if(this.audio != null && !(this.audio instanceof Audio)) {
            return this.audio instanceof Identifier ? this.audio : Identifier.fromId(this.audio);
        }
        return new Identifier(mod, "sounds/ui/" + this.id + ".ogg");
    }
    public createOggStream() {
        if(!(this.audio instanceof Audio)) return null;

        return this.audio.toStream("ogg");
    }
}