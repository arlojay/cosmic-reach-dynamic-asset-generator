import { Vector3, Vector3Like } from "three";
export declare class Direction {
    directionMap: DirectionMap | null;
    name: string;
    vector: Vector3;
    constructor(name: string, x: number, y: number, z: number);
    array(): number[];
    [Symbol.iterator](): Generator<number, void, unknown>;
    setDirectionMap(directionMap: DirectionMap): void;
    get x(): number;
    get y(): number;
    get z(): number;
    get uppercaseName(): string;
    is(name: string): boolean;
    inverse(): Direction;
    toString(): string;
}
export declare class DirectionList {
    directions: Set<Direction>;
    constructor(directions?: Direction[]);
    array(): Direction[];
    exclude(direction: Direction): Generator<Direction, void, unknown>;
    [Symbol.iterator](): Generator<Direction, void, unknown>;
    add(direction: Direction): void;
    remove(direction: Direction): void;
    has(direction: Direction): boolean;
    get size(): number;
    forEach(callback: (direction: Direction, index: number, set: Set<Direction>) => void): void;
    hasDirection(name: string): boolean;
    removeDirection(name: string): void;
    createBitmask(directionMap: DirectionMap): number;
    invert(directionMap: DirectionMap): DirectionList;
    clone(): DirectionList;
    toString(): string;
}
export declare class DirectionMap {
    directions: Map<string, Direction>;
    constructor(directions?: Direction[]);
    array(): Direction[];
    [Symbol.iterator](): Generator<Direction, void, unknown>;
    addDirection(direction: Direction): void;
    getDirection(name: string): Direction;
    values(): MapIterator<Direction>;
    keys(): MapIterator<string>;
    inverse(direction: Direction): Direction;
    vectorToDirection(vector: Vector3Like): Direction;
    all(): DirectionList;
    combinations(): DirectionList[];
}
export declare class Directions {
    static capitalize(direction: string): string;
    static uncapitalize(direction: string): string;
    static cardinals: DirectionMap;
    static relative: DirectionMap;
    static simpleBlock: DirectionMap;
}
