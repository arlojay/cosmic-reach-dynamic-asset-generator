"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Writer = void 0;
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const triggerSheet_1 = require("./triggerSheet");
const node_stream_1 = require("node:stream");
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
        for (const block of this.mod.blocks) {
            const blockPath = node_path_1.default.join(directory, block.getBlockPath());
            for (const state of block.getStates()) {
                usedBlockModels.add(state.model);
                usedTriggerSheets.add(state.triggerSheet);
            }
            this.writeFile(blockPath, block.serialize());
        }
        for (const blockModel of this.mod.blockModels) {
            const modelPath = node_path_1.default.join(directory, blockModel.getBlockModelPath());
            if (!usedBlockModels.has(blockModel))
                continue;
            for (const texture of blockModel.getUsedTextures()) {
                if (writtenBlockTextures.has(texture))
                    continue;
                if (texture.texture == null)
                    continue;
                this.writeFile(node_path_1.default.join(directory, texture.getAsBlockTexturePath()), texture.createTextureStream());
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
    }
}
exports.Writer = Writer;
