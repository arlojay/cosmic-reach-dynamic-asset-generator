"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Texture = void 0;
const canvas_1 = require("canvas");
const identifier_1 = require("./identifier");
class Texture {
    id;
    texture = null;
    static async loadFromFile(id, fullPath) {
        return new Texture(id, await (0, canvas_1.loadImage)(fullPath));
    }
    constructor(id, texture) {
        this.id = id;
        if (texture != null)
            this.texture = texture;
    }
    getAsBlockTexturePath() {
        return "textures/blocks/" + this.id + ".png";
    }
    getAsBlockTextureId(mod) {
        if (this.texture != null && !(this.texture instanceof canvas_1.Image)) {
            return this.texture instanceof identifier_1.Identifier ? this.texture : identifier_1.Identifier.fromId(this.texture);
        }
        return new identifier_1.Identifier(mod, "textures/blocks/" + this.id + ".png");
    }
    getAsItemTexturePath() {
        return "textures/items/" + this.id + ".png";
    }
    getAsItemTextureId(mod) {
        if (this.texture != null && !(this.texture instanceof canvas_1.Image)) {
            return this.texture instanceof identifier_1.Identifier ? this.texture : identifier_1.Identifier.fromId(this.texture);
        }
        return new identifier_1.Identifier(mod, "textures/items/" + this.id + ".png");
    }
    createTextureStream() {
        if (!(this.texture instanceof canvas_1.Image))
            return null;
        const canvas = (0, canvas_1.createCanvas)(this.texture.width, this.texture.height);
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.texture, 0, 0);
        return canvas.createPNGStream();
    }
}
exports.Texture = Texture;
