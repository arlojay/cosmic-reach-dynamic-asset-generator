"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorizedTexture = exports.ColorizedTextureMethod = void 0;
const canvas_1 = require("canvas");
const texture_1 = require("./texture");
var ColorizedTextureMethod;
(function (ColorizedTextureMethod) {
    ColorizedTextureMethod[ColorizedTextureMethod["MIX"] = 0] = "MIX";
    ColorizedTextureMethod[ColorizedTextureMethod["SOFT_LIGHT"] = 1] = "SOFT_LIGHT";
})(ColorizedTextureMethod || (exports.ColorizedTextureMethod = ColorizedTextureMethod = {}));
class ColorizedTexture {
    whiteTexture;
    blackTexture;
    colorMethod = ColorizedTextureMethod.MIX;
    static async createFromFiles(whiteSource, blackSource) {
        return new ColorizedTexture(await (0, canvas_1.loadImage)(whiteSource), await (0, canvas_1.loadImage)(blackSource));
    }
    static imageToCanvas(image) {
        const canvas = (0, canvas_1.createCanvas)(image.width, image.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        return canvas;
    }
    constructor(whiteTexture, blackTexture) {
        this.whiteTexture = ColorizedTexture.imageToCanvas(whiteTexture);
        this.blackTexture = ColorizedTexture.imageToCanvas(blackTexture);
    }
    setColorMethod(newMethod) {
        this.colorMethod = newMethod;
    }
    composite(white, black, intensity) {
        if (this.colorMethod == ColorizedTextureMethod.MIX) {
            return (white - black) * intensity + black;
        }
        if (this.colorMethod == ColorizedTextureMethod.SOFT_LIGHT) {
            return ((1 - 2 * intensity) * (white * white) + 2 * intensity * white);
        }
        return (white + black) / 2;
    }
    async createTexture(name, r, g, b, a = 1) {
        const canvas = (0, canvas_1.createCanvas)(this.whiteTexture.width, this.whiteTexture.height);
        const context = canvas.getContext("2d");
        const whiteData = this.whiteTexture.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
        const blackData = this.blackTexture.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
        const newData = context.getImageData(0, 0, canvas.width, canvas.height);
        for (let y = 0, i = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++, i += 4) {
                newData.data[i + 0] = Math.floor(this.composite(whiteData.data[i + 0] / 255, blackData.data[i + 0] / 255, r) * 255.999);
                newData.data[i + 1] = Math.floor(this.composite(whiteData.data[i + 1] / 255, blackData.data[i + 1] / 255, g) * 255.999);
                newData.data[i + 2] = Math.floor(this.composite(whiteData.data[i + 2] / 255, blackData.data[i + 2] / 255, b) * 255.999);
                newData.data[i + 3] = Math.floor(this.composite(whiteData.data[i + 3] / 255, blackData.data[i + 3] / 255, a) * 255.999);
            }
        }
        context.putImageData(newData, 0, 0);
        return new texture_1.Texture(name, await (0, canvas_1.loadImage)(canvas.toBuffer()));
    }
}
exports.ColorizedTexture = ColorizedTexture;
