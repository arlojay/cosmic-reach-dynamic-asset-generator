import path from "node:path";
import fs from "node:fs";
import { Mod } from "./mod";
import { BlockModel } from "./blockModel";
import { TriggerSheet } from "./triggerSheet";
import { Texture } from "./texture";
import { Stream } from "node:stream";

export class Writer {
    private mod: Mod;
    private checkedFolders: string[] = new Array;

    constructor(mod: Mod) {
        this.mod = mod;
    }

    private makePathToFile(file: string) {
        const tree = file.split(/[\/\\]/g).slice(0, -1);
        const joinedTree = tree.join("/");
        if(this.checkedFolders.includes(joinedTree)) return;

        const path: string[] = new Array;
        
        for(const dir of tree) {
            path.push(dir);
            const partialTree = path.join("/");
            if(!fs.existsSync(partialTree)) fs.mkdirSync(partialTree);
        }
        
        this.checkedFolders.push(joinedTree);
    }

    private writeFile(file: string, data: string | object | Stream) {
        this.makePathToFile(file);
        if(data instanceof Stream) {
            data.pipe(fs.createWriteStream(file));
        } else if(typeof data == "object") {
            fs.writeFileSync(file, JSON.stringify(data, null, 4));
        } else {
            fs.writeFileSync(file, data);
        }
    }

    public write(modFolder: string, keepOldFolder: boolean = false) {
        const directory = path.resolve(path.join(modFolder, this.mod.id));
        
        try {
            if(!keepOldFolder) fs.rmSync(directory, { recursive: true });
        } catch(e) {
            console.info(e);
        }

        const usedBlockModels: Set<BlockModel> = new Set;
        const usedTriggerSheets: Set<TriggerSheet> = new Set;
        const writtenBlockTextures: Set<Texture> = new Set;

        for(const block of this.mod.blocks) {
            const blockPath = path.join(directory, block.getBlockPath());

            for(const state of block.getStates()) {
                usedBlockModels.add(state.model);
                usedTriggerSheets.add(state.triggerSheet);
            }

            this.writeFile(blockPath, block.serialize());
        }

        for(const blockModel of this.mod.blockModels) {
            const modelPath = path.join(directory, blockModel.getBlockModelPath());

            if(!usedBlockModels.has(blockModel)) continue;

            for(const texture of blockModel.getUsedTextures()) {
                if(writtenBlockTextures.has(texture)) continue;
                if(texture.texture == null) continue;

                this.writeFile(
                    path.join(directory, texture.getAsBlockTexturePath()),
                    texture.createTextureStream()
                );

                writtenBlockTextures.add(texture);
            }

            this.writeFile(modelPath, blockModel.serialize());
        }
        
        let includedTriggerSheets = 0;
        do {
            includedTriggerSheets = 0;
            for(const triggerSheet of this.mod.triggerSheets) {
                if(!usedTriggerSheets.has(triggerSheet)) continue;
                if(!(triggerSheet.parent instanceof TriggerSheet)) continue;
                if(usedTriggerSheets.has(triggerSheet.parent)) continue;

                usedTriggerSheets.add(triggerSheet.parent);
                includedTriggerSheets++;
            }
        } while(includedTriggerSheets > 0);

        for(const triggerSheet of this.mod.triggerSheets) {
            const triggerSheetPath = path.join(directory, triggerSheet.getTriggerSheetPath());

            if(!usedTriggerSheets.has(triggerSheet)) continue;

            this.writeFile(triggerSheetPath, triggerSheet.serialize());
        }
    }
}