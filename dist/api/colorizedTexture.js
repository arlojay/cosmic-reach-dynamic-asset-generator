"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorizedTexture = void 0;
const canvas_1 = require("canvas");
const texture_1 = require("./texture");
class ColorizedTexture {
    whiteTexture;
    blackTexture;
    static async createFromFiles(whiteSource, blackSource) {
        return new ColorizedTexture(await (0, canvas_1.loadImage)(whiteSource), await (0, canvas_1.loadImage)(blackSource));
    }
    constructor(whiteTexture, blackTexture) {
        this.whiteTexture = ColorizedTexture.imageToCanvas(whiteTexture);
        this.blackTexture = ColorizedTexture.imageToCanvas(blackTexture);
    }
    static imageToCanvas(image) {
        const canvas = (0, canvas_1.createCanvas)(image.width, image.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        return canvas;
    }
    async createTexture(name, r, g, b, a = 0.5) {
        const canvas = (0, canvas_1.createCanvas)(this.whiteTexture.width, this.whiteTexture.height);
        const context = canvas.getContext("2d");
        const whiteData = this.whiteTexture.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
        const blackData = this.blackTexture.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
        const newData = context.getImageData(0, 0, canvas.width, canvas.height);
        for (let y = 0, i = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++, i += 4) {
                newData.data[i + 0] = (whiteData.data[i + 0] - blackData.data[i + 0]) * r + blackData.data[i + 0];
                newData.data[i + 1] = (whiteData.data[i + 1] - blackData.data[i + 1]) * g + blackData.data[i + 1];
                newData.data[i + 2] = (whiteData.data[i + 2] - blackData.data[i + 2]) * b + blackData.data[i + 2];
                newData.data[i + 3] = (whiteData.data[i + 3] - blackData.data[i + 3]) * a + blackData.data[i + 3];
            }
        }
        context.putImageData(newData, 0, 0);
        return new texture_1.Texture(name, await (0, canvas_1.loadImage)(canvas.toBuffer()));
    }
}
exports.ColorizedTexture = ColorizedTexture;
//# sourceMappingURL=colorizedTexture.js.map