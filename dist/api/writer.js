"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Writer = void 0;
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const blockModel_1 = require("./blockModel");
const triggerSheet_1 = require("./triggerSheet");
const node_stream_1 = require("node:stream");
const canvas_1 = require("canvas");
const lang_1 = require("./lang");
const ts_enum_util_1 = require("ts-enum-util");
function* joinIterators(iterator1, iterator2) {
    yield* iterator1;
    yield* iterator2;
}
class Writer {
    mod;
    checkedFolders = new Array;
    constructor(mod) {
        this.mod = mod;
    }
    makePathToFile(file) {
        const tree = file.split(/[\/\\]/g).slice(0, -1);
        const joinedTree = tree.join("/");
        if (this.checkedFolders.includes(joinedTree))
            return;
        const path = new Array;
        for (const dir of tree) {
            path.push(dir);
            const partialTree = path.join("/");
            if (!node_fs_1.default.existsSync(partialTree))
                node_fs_1.default.mkdirSync(partialTree);
        }
        this.checkedFolders.push(joinedTree);
    }
    writeFile(file, data) {
        this.makePathToFile(file);
        if (data instanceof node_stream_1.Stream) {
            data.pipe(node_fs_1.default.createWriteStream(file));
        }
        else if (typeof data == "object") {
            node_fs_1.default.writeFileSync(file, JSON.stringify(data, null, 4));
        }
        else {
            node_fs_1.default.writeFileSync(file, data);
        }
    }
    write(modFolder, keepOldFolder = false) {
        const directory = node_path_1.default.resolve(node_path_1.default.join(modFolder, this.mod.id));
        try {
            if (!keepOldFolder)
                node_fs_1.default.rmSync(directory, { recursive: true });
        }
        catch (e) {
            console.info(e);
        }
        const usedBlockModels = new Set;
        const usedTriggerSheets = new Set;
        const writtenBlockTextures = new Set;
        const writtenItemTextures = new Set;
        for (const block of this.mod.blocks) {
            const blockPath = node_path_1.default.join(directory, block.getBlockPath());
            for (const state of block.getStates()) {
                usedBlockModels.add(state.model);
                usedTriggerSheets.add(state.triggerSheet);
                if (state.langKey != null)
                    this.mod.langMap.addBlockKey(state.langKey);
            }
            this.writeFile(blockPath, block.serialize());
        }
        let includedBlockModels = 0;
        do {
            includedBlockModels = 0;
            for (const triggerSheet of this.mod.blockModels) {
                if (!usedBlockModels.has(triggerSheet))
                    continue;
                if (!(triggerSheet.parent instanceof blockModel_1.BlockModel))
                    continue;
                if (usedBlockModels.has(triggerSheet.parent))
                    continue;
                usedBlockModels.add(triggerSheet.parent);
                includedBlockModels++;
            }
        } while (includedBlockModels > 0);
        for (const blockModel of this.mod.blockModels) {
            const modelPath = node_path_1.default.join(directory, blockModel.getBlockModelPath());
            if (!usedBlockModels.has(blockModel))
                continue;
            for (const texture of joinIterators(blockModel.getUsedTextures().values(), blockModel.getTextureOverrides().values())) {
                if (writtenBlockTextures.has(texture))
                    continue;
                if (texture.texture instanceof canvas_1.Image) {
                    this.writeFile(node_path_1.default.join(directory, texture.getAsBlockTexturePath()), texture.createTextureStream());
                }
                writtenBlockTextures.add(texture);
            }
            this.writeFile(modelPath, blockModel.serialize());
        }
        let includedTriggerSheets = 0;
        do {
            includedTriggerSheets = 0;
            for (const triggerSheet of this.mod.triggerSheets) {
                if (!usedTriggerSheets.has(triggerSheet))
                    continue;
                if (!(triggerSheet.parent instanceof triggerSheet_1.TriggerSheet))
                    continue;
                if (usedTriggerSheets.has(triggerSheet.parent))
                    continue;
                usedTriggerSheets.add(triggerSheet.parent);
                includedTriggerSheets++;
            }
        } while (includedTriggerSheets > 0);
        for (const triggerSheet of this.mod.triggerSheets) {
            const triggerSheetPath = node_path_1.default.join(directory, triggerSheet.getTriggerSheetPath());
            if (!usedTriggerSheets.has(triggerSheet))
                continue;
            this.writeFile(triggerSheetPath, triggerSheet.serialize());
        }
        for (const item of this.mod.items) {
            const itemPath = node_path_1.default.join(directory, item.getItemPath());
            if (item.langKey != null)
                this.mod.langMap.addItemKey(item.langKey);
            const texture = item.texture;
            if (texture.texture instanceof canvas_1.Image) {
                if (!writtenBlockTextures.has(texture))
                    this.writeFile(node_path_1.default.join(directory, texture.getAsItemTexturePath()), texture.createTextureStream());
            }
            writtenBlockTextures.add(texture);
            this.writeFile(itemPath, item.serialize());
        }
        for (const craftingRecipe of this.mod.crafting.craftingRecipes) {
            this.writeFile(node_path_1.default.join(directory, craftingRecipe.getRecipePath().toString()), craftingRecipe.serialize());
        }
        for (const furnaceRecipe of this.mod.crafting.furnaceRecipes) {
            this.writeFile(node_path_1.default.join(directory, furnaceRecipe.getRecipePath().toString()), furnaceRecipe.serialize());
        }
        const langMap = this.mod.langMap.serialize();
        for (const languageType of (0, ts_enum_util_1.$enum)(lang_1.LangKeyLanguage).values()) {
            const languageName = (0, ts_enum_util_1.$enum)(lang_1.LangKeyLanguage).getKeyOrThrow(languageType);
            const language = langMap[languageType];
            if (language == null)
                continue;
            this.writeFile(node_path_1.default.join(directory, "lang", languageName, this.mod.id + "_items.json"), language.items);
            this.writeFile(node_path_1.default.join(directory, "lang", languageName, this.mod.id + "_blocks.json"), language.blocks);
        }
    }
}
exports.Writer = Writer;
