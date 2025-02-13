"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriggerSheet = exports.SerializedTriggerSheet = void 0;
const identifier_1 = require("./identifier");
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
    mod;
    id;
    parent;
    triggers = new Map;
    constructor(mod, id) {
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
    clone(newId) {
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
            allTriggers[id] = triggers.map(v => v.serialize());
        }
        const object = {
            stringId: this.id.toString(),
            triggers: allTriggers
        };
        if (this.parent != null) {
            if (this.parent instanceof TriggerSheet) {
                object.parent = this.parent.id.toString();
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
        return this.id.toString();
    }
}
exports.TriggerSheet = TriggerSheet;
