"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Identifier = void 0;
const mod_1 = require("./mod");
class Identifier {
    namespace;
    item;
    static fromId(id) {
        const [namespace, item] = id.split(":");
        return new Identifier(namespace ?? "", item ?? "");
    }
    constructor(namespace, item) {
        this.namespace = namespace;
        this.item = item;
    }
    getNamespace() {
        return (this.namespace instanceof mod_1.Mod) ? this.namespace.id : this.namespace.toString();
    }
    getItem() {
        return this.item.toString();
    }
    toString() {
        return this.getNamespace() + ":" + this.getItem();
    }
    derive(newItem) {
        return new Identifier(this.namespace, newItem);
    }
}
exports.Identifier = Identifier;
