import path from "node:path";
import fs, { stat } from "node:fs";
import { Mod } from "./mod";
import { BlockModel } from "./blockModel";
import { TriggerSheet } from "./triggerSheet";
import { Texture } from "./texture";
import { Stream } from "node:stream";
import { Image } from "canvas";
import { LangKey, LangKeyLanguage } from "./lang";
import { $enum } from "ts-enum-util";
import { Sound } from "./sound";
import { inspect } from "node:util";
import { BasicBlockStateGeneratorEntry, BlockStateGenerator, BlockStateGeneratorEntry, TemplatedBlockStateGeneratorEntry } from "./blockStateGenerator";

function* joinIterators<T>(iterator1: Iterable<T>, iterator2: Iterable<T>) {
    yield* iterator1;
    yield* iterator2;
}

export class Writer {
    private mod: Mod;
    private checkedFolders: string[] = new Array;
    public minifyJson: boolean;

    constructor(mod: Mod, minifyJson: boolean = false) {
        this.mod = mod;
        this.minifyJson = minifyJson;
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
        try {
            if(data instanceof Stream) {
                data.pipe(fs.createWriteStream(file));
            } else if(typeof data == "object") {
                fs.writeFileSync(file, this.minifyJson ? JSON.stringify(data) : JSON.stringify(data, null, 4));
            } else {
                fs.writeFileSync(file, data);
            }
        } catch(e) {
            console.error("Error writing object to disk");
            console.log(inspect(data, false, 8));
            throw e;
        }
    }

    public write(modFolder: string, keepOldFolder: boolean = false) {
        const directory = path.resolve(path.join(modFolder, this.mod.id));
        
        try {
            if(!keepOldFolder) fs.rmSync(directory, { recursive: true });
        } catch(e) {
            // console.info(e);
        }

        const usedBlockModels: Set<BlockModel> = new Set;
        const usedTriggerSheets: Set<TriggerSheet> = new Set;
        const writtenBlockTextures: Set<Texture> = new Set;
        const writtenItemTextures: Set<Texture> = new Set;
        const writtenSounds: Set<Sound> = new Set;

        for(const block of this.mod.blocks) {
            const blockPath = path.join(directory, block.getBlockPath());

            for(const state of block.getStates()) {
                if(state.model != null) usedBlockModels.add(state.model);
                if(state.triggerSheet != null) usedTriggerSheets.add(state.triggerSheet);

                if(state.langKey != null) this.mod.langMap.addBlockKey(state.langKey);
            }

            this.writeFile(blockPath, block.serialize());
        }

        for(const blockStateGenerator of this.mod.blockStateGenerators) {
            const blockStateGeneratorPath = path.join(directory, blockStateGenerator.getBlockStateGeneratorPath());

            this.writeFile(blockStateGeneratorPath, blockStateGenerator.serialize());

            for(const generator of blockStateGenerator.generators) {
                if(generator instanceof TemplatedBlockStateGeneratorEntry) {
                    usedBlockModels.add(generator.state.model);
                }
                if(generator instanceof BasicBlockStateGeneratorEntry) {
                    if(generator.model instanceof BlockModel) usedBlockModels.add(generator.model);
                }
            }
        }
        
        let includedBlockModels = 0;
        do {
            includedBlockModels = 0;
            for(const blockModel of this.mod.blockModels) {
                if(!usedBlockModels.has(blockModel)) continue;
                if(!(blockModel.parent instanceof BlockModel)) continue;

                if(blockModel.parent != null) {
                    if(usedBlockModels.has(blockModel.parent)) continue;
                    usedBlockModels.add(blockModel.parent);
                }
                includedBlockModels++;
            }
        } while(includedBlockModels > 0);

        for(const blockModel of usedBlockModels) {
            const modelPath = path.join(directory, blockModel.getBlockModelPath());

            for(const texture of joinIterators(blockModel.getUsedTextures().values(), blockModel.getTextureOverrides().values())) {
                if(writtenBlockTextures.has(texture)) continue;
                if(texture.texture instanceof Image) {
                    this.writeFile(
                        path.join(directory, texture.getAsBlockTexturePath()),
                        texture.createTextureStream()
                    );
                }

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

                if(triggerSheet.parent != null) {
                    if(usedTriggerSheets.has(triggerSheet.parent)) continue;
                    usedTriggerSheets.add(triggerSheet.parent);
                }
                includedTriggerSheets++;
            }
        } while(includedTriggerSheets > 0);

        for(const triggerSheet of usedTriggerSheets) {
            const triggerSheetPath = path.join(directory, triggerSheet.getTriggerSheetPath());

            if(!usedTriggerSheets.has(triggerSheet)) continue;

            this.writeFile(triggerSheetPath, triggerSheet.serialize());

            const sounds = triggerSheet.getAllSoundInstances();
            for(const sound of sounds) {
                if(writtenSounds.has(sound)) continue;

                const soundsPath = path.join(directory, sound.getAsBlockSoundPath());

                this.writeFile(soundsPath, sound.createOggStream());
            }
        }

        for(const item of this.mod.items) {
            const itemPath = path.join(directory, item.getItemPath());

            if(item.langKey != null) this.mod.langMap.addItemKey(item.langKey);
            
            const texture = item.texture;

            if(texture.texture instanceof Image) {
                if(!writtenItemTextures.has(texture)) this.writeFile(
                    path.join(directory, texture.getAsItemTexturePath()),
                    texture.createTextureStream()
                );
            }

            writtenItemTextures.add(texture);

            this.writeFile(itemPath, item.serialize());
        }

        for(const craftingRecipe of this.mod.crafting.craftingRecipes) {
            this.writeFile(
                path.join(directory, craftingRecipe.getRecipePath().toString()),
                craftingRecipe.serialize()
            );
        }
        for(const furnaceRecipe of this.mod.crafting.furnaceRecipes) {
            this.writeFile(
                path.join(directory, furnaceRecipe.getRecipePath().toString()),
                furnaceRecipe.serialize()
            );
        }

        const langMap = this.mod.langMap.serialize();

        for(const languageType of $enum(LangKeyLanguage).values()) {
            const languageName = $enum(LangKeyLanguage).getKeyOrThrow(languageType);
            const language = langMap[languageType];

            if(language == null) continue;

            this.writeFile(
                path.join(directory, "lang", languageName, this.mod.id + "_items.json"),
                language.items
            );
            this.writeFile(
                path.join(directory, "lang", languageName, this.mod.id + "_blocks.json"),
                language.blocks
            );
        }
    }
}