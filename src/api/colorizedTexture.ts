import { Canvas, Image, createCanvas, loadImage } from "canvas";
import { Texture } from "./texture";

export class ColorizedTexture {
    public whiteTexture: Canvas;
    public blackTexture: Canvas;
    
    static async createFromFiles(whiteSource: string, blackSource: string): Promise<ColorizedTexture> {
        return new ColorizedTexture(await loadImage(whiteSource), await loadImage(blackSource));
    }
    
    constructor(whiteTexture: Image, blackTexture: Image) {
        this.whiteTexture = ColorizedTexture.imageToCanvas(whiteTexture);
        this.blackTexture = ColorizedTexture.imageToCanvas(blackTexture);
    }
    
    private static imageToCanvas(image: Image): Canvas {
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        return canvas;
    }
    
    async createTexture(name: string, r: number, g: number, b: number, a: number = 0.5): Promise<Texture> {
        const canvas = createCanvas(this.whiteTexture.width, this.whiteTexture.height);
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

        
        return new Texture(name, await loadImage(canvas.toBuffer()));
    }
}