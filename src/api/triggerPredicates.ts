export class TriggerPredicate<T> {
    public constructor(predicate?: T) {
        Object.assign(this, predicate);
    }
}

export class LogicPredicate extends TriggerPredicate<ILogicPredicate> {
    // public constructor(predicate: ILogicPredicate) {
    //     if("not" in predicate) {
    //         super({
    //             ...predicate,
    //             not: [ predicate.not ]
    //         })
    //     } else {
    //         super(predicate);
    //     }
    // }
}
export interface ILogicPredicate {
    or?: TriggerPredicate<any>[];
    and?: TriggerPredicate<any>[];
    xor?: TriggerPredicate<any>[];
    not?: TriggerPredicate<any>;
    random?: RandomPredicate;
}

export class BlockEventPredicate extends TriggerPredicate<IBlockEventPredicate> { }
export interface IBlockEventPredicate {
    srcPlayer?: PlayerPredicate;
    srcBlockState?: IBlockStatePredicate;
    block_at?: IBlockStateWithPosPredicate;
}

export class BlockStatePredicate extends TriggerPredicate<IBlockStatePredicate> { }
export interface IBlockStatePredicate {
    has_tag?: string;
    has_param?: string | {
        param: string;
        value: string;
    };
    has_block_id?: string;
}

export class BlockStateWithPosPredicate extends TriggerPredicate<IBlockStateWithPosPredicate> { }
export interface IBlockStateWithPosPredicate extends IBlockStatePredicate {
    xOff: number;
    yOff: number;
    zOff: number;
}

export class PlayerGamemodePredicate extends TriggerPredicate<IPlayerGamemodePredicate> { }
export interface IPlayerGamemodePredicate {
    allows_items_drop_on_break: boolean;
}

export class PlayerPredicate extends TriggerPredicate<IPlayerPredicate> { }
export interface IPlayerPredicate {
    gamemode: PlayerGamemodePredicate;
}

export class RandomPredicate extends TriggerPredicate<IRandomPredicate>{ }
export interface IRandomPredicate {
    normalChance: number;
}