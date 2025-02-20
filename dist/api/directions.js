"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Directions = exports.DirectionMap = exports.DirectionList = exports.Direction = void 0;
const three_1 = require("three");
class Direction {
    directionMap = null;
    name;
    vector;
    constructor(name, x, y, z) {
        this.name = name;
        this.vector = new three_1.Vector3(x, y, z);
    }
    array() {
        return Array.from(this);
    }
    *[Symbol.iterator]() {
        yield* this.vector.toArray();
    }
    setDirectionMap(directionMap) {
        this.directionMap = directionMap;
    }
    get x() {
        return this.vector.x;
    }
    get y() {
        return this.vector.y;
    }
    get z() {
        return this.vector.z;
    }
    get uppercaseName() {
        return this.name[0].toUpperCase() + this.name.slice(1);
    }
    is(name) {
        return this.name.toLowerCase() === name.toLowerCase();
    }
    inverse() {
        return this.directionMap.inverse(this);
    }
    toString() {
        return this.name;
    }
}
exports.Direction = Direction;
class DirectionList {
    directions;
    constructor(directions = []) {
        this.directions = new Set(directions);
    }
    array() {
        return Array.from(this);
    }
    *exclude(direction) {
        for (const otherDirection of this) {
            if (otherDirection != direction)
                yield otherDirection;
        }
    }
    *[Symbol.iterator]() {
        yield* this.directions;
    }
    add(direction) {
        this.directions.add(direction);
    }
    remove(direction) {
        this.directions.delete(direction);
    }
    has(direction) {
        return this.directions.has(direction);
    }
    get size() {
        return this.directions.size;
    }
    forEach(callback) {
        let i = 0;
        this.directions.forEach(direction => callback(direction, i++, this.directions));
    }
    hasDirection(name) {
        return Array.from(this.directions).some(direction => direction.is(name));
    }
    removeDirection(name) {
        for (const direction of this.directions) {
            if (direction.is(name))
                this.directions.delete(direction);
        }
    }
    createBitmask(directionMap) {
        return Array.from(directionMap.values()).reduce((bitmask, dir, i) => bitmask | (this.directions.has(dir) ? 1 << i : 0), 0);
    }
    invert(directionMap) {
        const clone = this.clone();
        const invertedDirections = new Set(Array.from(directionMap.values()).filter(dir => !clone.directions.has(dir)));
        clone.directions = invertedDirections;
        return clone;
    }
    clone() {
        return new DirectionList(Array.from(this.directions));
    }
    toString() {
        return this.directions.size === 0 ? "none" : Array.from(this.directions).map(v => v.name).join("-");
    }
}
exports.DirectionList = DirectionList;
class DirectionMap {
    directions = new Map;
    constructor(directions = []) {
        for (const direction of directions) {
            this.addDirection(direction);
        }
    }
    array() {
        return Array.from(this);
    }
    *[Symbol.iterator]() {
        yield* this.directions.values();
    }
    addDirection(direction) {
        direction.setDirectionMap(this);
        this.directions.set(direction.name, direction);
    }
    getDirection(name) {
        return this.directions.get(name.toLowerCase());
    }
    values() {
        return this.directions.values();
    }
    keys() {
        return this.directions.keys();
    }
    inverse(direction) {
        const inverseVector = direction.vector.clone().multiplyScalar(-1);
        return this.vectorToDirection(inverseVector);
    }
    vectorToDirection(vector) {
        return Array.from(this.directions.values()).reduce((closest, dir) => {
            const distance = dir.vector.clone().normalize().distanceTo(new three_1.Vector3().copy(vector).normalize());
            return distance < closest.distance ? { direction: dir, distance } : closest;
        }, { direction: null, distance: Infinity }).direction;
    }
    all() {
        return new DirectionList(this.array());
    }
    combinations() {
        const keys = Array.from(this.directions.keys());
        const totalCombinations = 2 ** keys.length;
        return Array.from({ length: totalCombinations }, (_, i) => new DirectionList(keys
            .filter((_, j) => (i & (1 << j)) !== 0)
            .map(k => this.directions.get(k))));
    }
}
exports.DirectionMap = DirectionMap;
class Directions {
    static capitalize(direction) {
        return direction[0].toUpperCase() + direction.slice(1);
    }
    static uncapitalize(direction) {
        return direction.toLowerCase();
    }
    static cardinals = new DirectionMap([
        new Direction("north", 0, 0, -1),
        new Direction("east", 1, 0, 0),
        new Direction("south", 0, 0, 1),
        new Direction("west", -1, 0, 0),
        new Direction("up", 0, 1, 0),
        new Direction("down", 0, -1, 0),
    ]);
    static relative = new DirectionMap([
        new Direction("front", 0, 0, -1),
        new Direction("right", 1, 0, 0),
        new Direction("back", 0, 0, 1),
        new Direction("left", -1, 0, 0),
        new Direction("top", 0, 1, 0),
        new Direction("bottom", 0, -1, 0)
    ]);
    static simpleBlock = new DirectionMap([
        new Direction("front", 0, 0, 1),
        new Direction("back", 0, 0, -1),
        new Direction("side", 0, 0, 0)
    ]);
    static nativeRotation = new DirectionMap([
        new Direction("NegX", -1, 0, 0),
        new Direction("PosX", 1, 0, 0),
        new Direction("NegZ", 0, 0, -1),
        new Direction("PosZ", 0, 0, 1),
    ]);
}
exports.Directions = Directions;
