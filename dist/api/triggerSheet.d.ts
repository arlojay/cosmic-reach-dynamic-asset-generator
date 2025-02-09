import { Identifier } from "./identifier";
import { Mod } from "./mod";
import { TriggerAction } from "./triggerActions";
export declare class SerializedTriggerSheet {
    parent?: string;
    stringId: string;
    triggers: Record<string, TriggerAction[]>;
}
export declare class TriggerSheet {
    mod: Mod;
    id: Identifier;
    parent: Identifier | string | TriggerSheet;
    triggers: Map<string, TriggerAction[]>;
    constructor(mod: Mod, id: Identifier);
    setParent(parent: Identifier | string | TriggerSheet): void;
    addTrigger(id: string, ...triggers: TriggerAction[]): void;
    clone(newId: string): TriggerSheet;
    addTriggerSheet(...triggerSheets: TriggerSheet[]): void;
    serialize(): SerializedTriggerSheet;
    getTriggerSheetPath(): string;
    getTriggerSheetId(): string;
}
