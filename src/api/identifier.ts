/*
Copyright 2025 arlojay

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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