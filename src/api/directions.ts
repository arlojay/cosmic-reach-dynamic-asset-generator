import { Vector3, Vector3Like } from "three";

export class Direction {
    directionMap: DirectionMap | null = null;
    name: string;
    vector: Vector3;

    constructor(name: string, x: number, y: number, z: number) {
        this.name = name;
        this.vector = new Vector3(x, y, z);
    }

    array() {
        return Array.from(this);
    }

    *[Symbol.iterator]() {
        yield* this.vector.toArray();
    }

    setDirectionMap(directionMap: DirectionMap) {
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

    is(name: Direction | string) {
        if(name instanceof Direction) return (name.x == this.x && name.y == this.y && name.z == this.z) || name.name == this.name;
        return this.name.toLowerCase() === name.toLowerCase();
    }

    inverse() {
        return this.directionMap!.inverse(this);
    }

    toString() {
        return this.name;
    }
}

export class DirectionList {
    directions: Set<Direction>;

    constructor(directions: Direction[] = []) {
        this.directions = new Set(directions);
    }

    array() {
        return Array.from(this);
    }

    *exclude(...directions: Direction[]) {
        for(const otherDirection of this) {
            if(!directions.includes(otherDirection)) yield otherDirection;
        }
    }

    *[Symbol.iterator]() {
        yield* this.directions;
    }

    add(direction: Direction) {
        this.directions.add(direction);
    }

    remove(direction: Direction) {
        this.directions.delete(direction);
    }

    has(direction: Direction) {
        return this.directions.has(direction);
    }

    get size() {
        return this.directions.size;
    }

    forEach(callback: (direction: Direction, index: number, set: Set<Direction>) => void) {
        let i = 0;
        this.directions.forEach(direction => callback(direction, i++, this.directions));
    }

    hasDirection(name: string) {
        return Array.from(this.directions).some(direction => direction.is(name));
    }

    removeDirection(name: string) {
        for (const direction of this.directions) {
            if (direction.is(name)) this.directions.delete(direction);
        }
    }

    createBitmask(directionMap: DirectionMap) {
        return Array.from(directionMap.values()).reduce((bitmask, dir, i) => 
            bitmask | (this.directions.has(dir) ? 1 << i : 0), 0);
    }

    invert(directionMap: DirectionMap): DirectionList {
        const clone = this.clone();
        const invertedDirections = new Set(
            Array.from(directionMap.values()).filter(dir => !clone.directions.has(dir))
        );
        clone.directions = invertedDirections;
        return clone;
    }

    clone() {
        return new DirectionList(Array.from(this.directions));
    }

    toString(): string {
        return this.directions.size === 0 ? "none" : Array.from(this.directions).map(v => v.name).join("-");
    }
}

export class DirectionMap {
    directions: Map<string, Direction> = new Map;

    constructor(directions: Direction[] = []) {
        for(const direction of directions) {
            this.addDirection(direction);
        }
    }

    array() {
        return Array.from(this);
    }

    *[Symbol.iterator]() {
        yield* this.directions.values();
    }

    addDirection(direction: Direction) {
        direction.setDirectionMap(this);
        this.directions.set(direction.name, direction);
    }

    getDirection(name: string) {
        return this.directions.get(name) ?? this.directions.entries().find(([n, d]) => n.toLowerCase() == name.toLowerCase())?.[1];
    }

    values() {
        return this.directions.values();
    }

    keys() {
        return this.directions.keys();
    }

    inverse(direction: Direction): Direction {
        const inverseVector = direction.vector.clone().multiplyScalar(-1);
        return this.vectorToDirection(inverseVector);
    }

    vectorToDirection(vector: Vector3Like): Direction {
        return Array.from(this.directions.values()).reduce((closest, dir) => {
            const distance = dir.vector.clone().normalize().distanceTo(new Vector3().copy(vector).normalize());
            return distance < closest.distance ? { direction: dir, distance } : closest;
        }, { direction: null as Direction | null, distance: Infinity }).direction!;
    }

    all(): DirectionList {
        return new DirectionList(this.array());
    }

    combinations(): DirectionList[] {
        const keys = Array.from(this.directions.keys());
        const totalCombinations = 2 ** keys.length;
        return Array.from({ length: totalCombinations }, (_, i) =>
            new DirectionList(keys
                .filter((_, j) => (i & (1 << j)) !== 0)
                .map(k => this.directions.get(k)!)
            )
        );
    }
}

export class Directions {
    public static capitalize(direction: string): string {
        return direction[0].toUpperCase() + direction.slice(1);
    }

    public static uncapitalize(direction: string): string {
        return direction.toLowerCase();
    }

    public static cardinals = new DirectionMap([
        new Direction("north", 0, 0, -1),
        new Direction("east", 1, 0, 0),
        new Direction("south", 0, 0, 1),
        new Direction("west", -1, 0, 0),
        new Direction("up", 0, 1, 0),
        new Direction("down", 0, -1, 0),
    ]);

    public static relative = new DirectionMap([
        new Direction("front", 0, 0, -1),
        new Direction("right", 1, 0, 0),
        new Direction("back", 0, 0, 1),
        new Direction("left", -1, 0, 0),
        new Direction("top", 0, 1, 0),
        new Direction("bottom", 0, -1, 0)
    ]);

    public static simpleBlock = new DirectionMap([
        new Direction("front", 0, 0, 1),
        new Direction("back", 0, 0, -1),
        new Direction("side", 0, 0, 0)
    ]);

    public static nativeRotation = new DirectionMap([
        new Direction("NegX", -1, 0, 0),
        new Direction("PosX", 1, 0, 0),
        new Direction("NegZ", 0, 0, -1),
        new Direction("PosZ", 0, 0, 1),
    ]);

    public static omnidirectionalRotation = new DirectionMap([
        new Direction("NegX", -1, 0, 0),
        new Direction("PosX", 1, 0, 0),
        new Direction("NegY", 0, -1, 0),
        new Direction("PosY", 0, 1, 0),
        new Direction("NegZ", 0, 0, -1),
        new Direction("PosZ", 0, 0, 1),
    ]);
}