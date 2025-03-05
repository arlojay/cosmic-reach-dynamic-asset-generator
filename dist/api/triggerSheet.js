"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriggerSheet = exports.SerializedTriggerSheet = void 0;
const identifier_1 = require("./identifier");
const sound_1 = require("./sound");
const triggerActions_1 = require("./triggerActions");
function deepClone(object) {
    return JSON.parse(JSON.stringify(object));
}
class SerializedTriggerSheet {
    parent;
    stringId;
    triggers;
}
exports.SerializedTriggerSheet = SerializedTriggerSheet;
class TriggerSheet {
    static tempSheetsCreated = 0;
    static nextTempSheetName() {
        return "temp_sheet_" + (this.tempSheetsCreated++);
    }
    mod;
    id;
    parent;
    triggers = new Map;
    constructor(mod = null, id = new identifier_1.Identifier(mod, TriggerSheet.nextTempSheetName())) {
        this.mod = mod;
        this.id = id;
    }
    setParent(parent) {
        this.parent = parent;
    }
    addTrigger(id, ...triggers) {
        const triggerList = this.triggers.get(id) ?? new Array;
        for (const trigger of triggers) {
            triggerList.push(trigger);
        }
        this.triggers.set(id, triggerList);
    }
    clone(newId = TriggerSheet.nextTempSheetName()) {
        const sheet = new TriggerSheet(this.mod, this.id.derive(newId));
        sheet.addTriggerSheet(this);
        return sheet;
    }
    addTriggerSheet(...triggerSheets) {
        for (const triggerSheet of triggerSheets) {
            for (const [id, triggers] of triggerSheet.triggers) {
                this.addTrigger(id, ...triggers.map(trigger => deepClone(trigger)));
            }
        }
    }
    serialize() {
        const allTriggers = {};
        for (const [id, triggers] of this.triggers) {
            allTriggers[id] = triggers.map(v => v.serialize(this.mod));
        }
        const object = {
            stringId: this.getTriggerSheetId(),
            triggers: allTriggers
        };
        if (this.parent != null) {
            if (this.parent instanceof TriggerSheet) {
                object.parent = this.parent.getTriggerSheetId().toString();
            }
            else if (this.parent instanceof identifier_1.Identifier) {
                object.parent = this.parent.toString();
            }
            else {
                object.parent = this.parent;
            }
        }
        return object;
    }
    getTriggerSheetPath() {
        return "block_events/" + this.id.getItem() + ".json";
    }
    getTriggerSheetId() {
        return this.id.toString().replace(/\//g, "•");
    }
    getAllActions() {
        return Array.from(this.triggers.values()
            .reduce((p, c) => p.concat(c), new Array));
    }
    getAllSoundInstances() {
        const allSounds = new Array;
        for (const action of this.getAllActions()) {
            if ((action instanceof triggerActions_1.PlaySound2DAction) || (action instanceof triggerActions_1.PlaySound3DAction)) {
                if (action.parameters.sound instanceof sound_1.Sound)
                    allSounds.push(action.parameters.sound);
            }
        }
        return allSounds;
    }
}
exports.TriggerSheet = TriggerSheet;
