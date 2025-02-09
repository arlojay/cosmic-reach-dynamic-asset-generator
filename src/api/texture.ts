import { createCanvas, Image, loadImage } from "canvas";
import { Mod } from "./mod";
import { Identifier } from "./identifier";

export class Texture {
    public id: string;
    public texture: Image | null = null;

    public static async loadFromFile(id: string, fullPath: string) {
        return new Texture(id, await loadImage(fullPath));
    }

    constructor(id: string, texture?: Image) {
        this.id = id;
        if(texture != null) this.texture = texture;
    }

    public getAsBlockTexturePath(): string {
        return "textures/blocks/" + this.id + ".png";
    }
    public getAsBlockTextureId(mod: Mod): Identifier {
        return new Identifier(mod, "textures/blocks/" + this.id + ".png");
    }
    public getAsItemTexturePath(): string {
        return "textures/items/" + this.id + ".png";
    }
    public getAsItemTextureId(mod: Mod): Identifier {
        return new Identifier(mod, "textures/items/" + this.id + ".png");
    }
    public createTextureStream() {
        const canvas = createCanvas(this.texture.width, this.texture.height);
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.texture, 0, 0);
        return canvas.createPNGStream();
    }
}