import { Mod } from "./mod";

type Namespace = Mod | { toString(): string } | string;
type Item = { toString(): string } | string;

export class Identifier {
    private namespace: Namespace;
    private item: Item;

    public static fromId(id: string) {
        const [ namespace, item ] = id.split(":");
        return new Identifier(namespace ?? "", item ?? "");
    }

    constructor(namespace: Namespace, item: Item) {
        this.namespace = namespace;
        this.item = item;
    }

    public getNamespace() {
        return (this.namespace instanceof Mod) ? this.namespace.id : this.namespace.toString();
    }

    public getItem() {
        return this.item.toString();
    }

    toString() {
        return this.getNamespace() + ":" + this.getItem();
    }

    public derive(newItem: Item) {
        return new Identifier(this.namespace, newItem);
    }
}