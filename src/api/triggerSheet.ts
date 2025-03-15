import { inspect } from "util";
import { Identifier } from "./identifier";
import { Mod } from "./mod";
import { Sound } from "./sound";
import { PlaySound2DAction, PlaySound3DAction, TriggerAction } from "./triggerActions";

function deepClone<T>(object: T): T {
    return JSON.parse(JSON.stringify(object));
}

export class SerializedTriggerSheet {
    parent?: string;
    stringId: string;
    triggers: Record<string, TriggerAction[]>;
}

export class TriggerSheet {
    private static tempSheetsCreated: number = 0;
    private static nextTempSheetName(): string {
        return "temp_sheet_" + (this.tempSheetsCreated++);
    }

    private mod: Mod;
    public id: Identifier;

    public parent: Identifier | string | TriggerSheet;
    public triggers: Map<string, TriggerAction[]> = new Map;

    public constructor(mod: Mod = null, id: Identifier = new Identifier(mod, TriggerSheet.nextTempSheetName())) {
        this.mod = mod;
        this.id = id;
    }

    public setParent(parent: Identifier | string | TriggerSheet) {
        this.parent = parent;
    }

    public onUpdate(...triggers: TriggerAction[]) {
        this.addTrigger("relayOnBlockUpdate", ...triggers);
    }

    public addTrigger(id: string, ...triggers: TriggerAction[]) {
        const triggerList = this.triggers.get(id) ?? new Array;

        for(const trigger of triggers) {
            triggerList.push(trigger);
        }

        this.triggers.set(id, triggerList);
    }

    public clone(newId: string = TriggerSheet.nextTempSheetName()) {
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
            allTriggers[id] = triggers.map(v => v.serialize(this.mod));
        }

        const object: SerializedTriggerSheet = {
            stringId: this.getTriggerSheetId(),
            triggers: allTriggers
        };

        if(this.parent != null) {
            if(this.parent instanceof TriggerSheet) {
                object.parent = this.parent.getTriggerSheetId().toString();
            } else if(this.parent instanceof Identifier) {
                object.parent = this.parent.toString();
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
        return this.id.toString().replace(/\//g, "•");
    }

    public getAllActions() {
        return Array.from(
            this.triggers.values()
            .reduce((p, c) =>
                p.concat(c),
                new Array<TriggerAction<any>>
            )
        )
    }
    public getAllSoundInstances(): Sound[] {
        const allSounds: Sound[] = new Array;

        for(const action of this.getAllActions()) {
            if((action instanceof PlaySound2DAction) || (action instanceof PlaySound3DAction)) {
                if(action.parameters.sound instanceof Sound) allSounds.push(action.parameters.sound);
            }
        }

        return allSounds;
    }
}