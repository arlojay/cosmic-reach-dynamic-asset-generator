"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sound = void 0;
const fs_1 = require("fs");
const identifier_1 = require("./identifier");
const audio_1 = require("./audio");
class Sound {
    id;
    audio = null;
    static async loadFromFile(id, fullPath) {
        const data = (0, fs_1.readFileSync)(fullPath);
        return new Sound(id, await audio_1.Audio.fromFile(data));
    }
    constructor(id, audio) {
        this.id = id;
        if (audio != null)
            this.audio = audio;
    }
    getAudio() {
        if (this.audio instanceof audio_1.Audio)
            return this.audio;
        return null;
    }
    getAsBlockSoundPath() {
        return "sounds/blocks/" + this.id + ".ogg";
    }
    getAsBlockSoundId(mod) {
        if (this.audio != null && !(this.audio instanceof audio_1.Audio)) {
            return this.audio instanceof identifier_1.Identifier ? this.audio : identifier_1.Identifier.fromId(this.audio);
        }
        return new identifier_1.Identifier(mod, "sounds/blocks/" + this.id + ".ogg");
    }
    getAsItemSoundPath() {
        return "sounds/items/" + this.id + ".ogg";
    }
    getAsItemSoundId(mod) {
        if (this.audio != null && !(this.audio instanceof audio_1.Audio)) {
            return this.audio instanceof identifier_1.Identifier ? this.audio : identifier_1.Identifier.fromId(this.audio);
        }
        return new identifier_1.Identifier(mod, "sounds/items/" + this.id + ".ogg");
    }
    getAsEntitySoundPath() {
        return "sounds/entities/" + this.id + ".ogg";
    }
    getAsEntitySoundId(mod) {
        if (this.audio != null && !(this.audio instanceof audio_1.Audio)) {
            return this.audio instanceof identifier_1.Identifier ? this.audio : identifier_1.Identifier.fromId(this.audio);
        }
        return new identifier_1.Identifier(mod, "sounds/entities/" + this.id + ".ogg");
    }
    getAsUISoundPath() {
        return "sounds/ui/" + this.id + ".ogg";
    }
    getAsUISoundId(mod) {
        if (this.audio != null && !(this.audio instanceof audio_1.Audio)) {
            return this.audio instanceof identifier_1.Identifier ? this.audio : identifier_1.Identifier.fromId(this.audio);
        }
        return new identifier_1.Identifier(mod, "sounds/ui/" + this.id + ".ogg");
    }
    createOggStream() {
        if (!(this.audio instanceof audio_1.Audio))
            return null;
        return this.audio.toStream("ogg");
    }
}
exports.Sound = Sound;
