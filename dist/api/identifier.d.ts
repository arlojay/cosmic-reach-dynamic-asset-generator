import { Mod } from "./mod";
type Namespace = Mod | {
    toString(): string;
} | string;
type Item = {
    toString(): string;
} | string;
export declare class Identifier {
    private namespace;
    private item;
    static fromId(id: string): Identifier;
    constructor(namespace: Namespace, item: Item);
    getNamespace(): string;
    getItem(): string;
    toString(): string;
    derive(newItem: Item): Identifier;
}
export {};
