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

import { Canvas, Image, createCanvas, loadImage } from "canvas";
import { Texture } from "./texture";

export enum ColorizedTextureMethod { MIX, SOFT_LIGHT }

export class ColorizedTexture {
    public whiteTexture: Canvas;
    public blackTexture: Canvas;
    public colorMethod: ColorizedTextureMethod = ColorizedTextureMethod.MIX;
    
    static async createFromFiles(whiteSource: string, blackSource: string): Promise<ColorizedTexture> {
        return new ColorizedTexture(await loadImage(whiteSource), await loadImage(blackSource));
    }
    
    private static imageToCanvas(image: Image): Canvas {
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        return canvas;
    }
    
    constructor(whiteTexture: Image, blackTexture: Image) {
        this.whiteTexture = ColorizedTexture.imageToCanvas(whiteTexture);
        this.blackTexture = ColorizedTexture.imageToCanvas(blackTexture);
    }

    public setColorMethod(newMethod: ColorizedTextureMethod) {
        this.colorMethod = newMethod;
    }

    private composite(white: number, black: number, intensity: number) {
        if(this.colorMethod == ColorizedTextureMethod.MIX) {
            return (white - black) * intensity + black;
        }
        if(this.colorMethod == ColorizedTextureMethod.SOFT_LIGHT) {
            return ((1 - 2 * intensity) * (white * white) + 2 * intensity * white);
        }

        return (white + black) / 2;
    }
    
    async createTexture(name: string, r: number, g: number, b: number, a: number = 1): Promise<Texture> {
        const canvas = createCanvas(this.whiteTexture.width, this.whiteTexture.height);
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

        
        return new Texture(name, await loadImage(canvas.toBuffer()));
    }
}