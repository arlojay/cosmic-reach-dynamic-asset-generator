export class TriggerPredicate<T> {
    public constructor(predicate?: T) {
        Object.assign(this, predicate);
    }
}

export class LogicPredicate extends TriggerPredicate<ILogicPredicate> { }
export interface ILogicPredicate {
    or?: TriggerPredicate<any>[];
    and?: TriggerPredicate<any>[];
    xor?: TriggerPredicate<any>[];
    not?: TriggerPredicate<any>;
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

export interface PlayerPredicate extends TriggerPredicate<IPlayerPredicate> { }
export interface IPlayerPredicate {
    gamemode: PlayerGamemodePredicate;
}