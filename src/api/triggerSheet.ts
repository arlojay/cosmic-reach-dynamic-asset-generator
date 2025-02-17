import { Identifier } from "./identifier";
import { Mod } from "./mod";
import { TriggerAction } from "./triggerActions";

function deepClone<T>(object: T): T {
    return JSON.parse(JSON.stringify(object));
}

export class SerializedTriggerSheet {
    parent?: string;
    stringId: string;
    triggers: Record<string, TriggerAction[]>;
}

export class TriggerSheet {
    public mod: Mod;
    public id: Identifier;

    public parent: Identifier | string | TriggerSheet;
    public triggers: Map<string, TriggerAction[]> = new Map;

    public constructor(mod: Mod, id: Identifier) {
        this.mod = mod;
        this.id = id;
    }

    public setParent(parent: Identifier | string | TriggerSheet) {
        this.parent = parent;
    }

    public addTrigger(id: string, ...triggers: TriggerAction[]) {
        const triggerList = this.triggers.get(id) ?? new Array;

        for(const trigger of triggers) {
            triggerList.push(trigger);
        }

        this.triggers.set(id, triggerList);
    }

    public clone(newId: string) {
        const sheet = new TriggerSheet(this.mod, this.id.derive(newId));

        sheet.addTriggerSheet(this);
        
        return sheet;
    }

    public addTriggerSheet(...triggerSheets: TriggerSheet[]) {
        for(const triggerSheet of triggerSheets) {
            for(const [ id, triggers ] of triggerSheet.triggers) {
                this.addTrigger(id, ...triggers.map(trigger => deepClone(trigger)));
            }
        }
    }

    public serialize() {
        const allTriggers: Record<string, any> = {};

        for(const [ id, triggers ] of this.triggers) {
            allTriggers[id] = triggers.map(v => v.serialize());
        }

        const object: SerializedTriggerSheet = {
            stringId: this.id.toString(),
            triggers: allTriggers
        };

        if(this.parent != null) {
            if(this.parent instanceof TriggerSheet) {
                object.parent = this.parent.getTriggerSheetId().toString();
            } else if(this.parent instanceof Identifier) {
                object.parent = this.parent.derive("block_events/" + this.parent.getItem() + ".json").toString();
            } else {
                object.parent = this.parent;
            }
        }

        return object;
    }

    public getTriggerSheetPath() {
        return "block_events/" + this.id.getItem() + ".json";
    }
    public getTriggerSheetId() {
        return this.id.toString();
    }
}