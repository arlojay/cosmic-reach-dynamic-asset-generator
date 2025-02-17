export declare class TriggerPredicate<T> {
    constructor(predicate?: T);
}
export declare class LogicPredicate extends TriggerPredicate<ILogicPredicate> {
}
export interface ILogicPredicate {
    or?: TriggerPredicate<any>[];
    and?: TriggerPredicate<any>[];
    xor?: TriggerPredicate<any>[];
    not?: TriggerPredicate<any>;
}
export declare class BlockEventPredicate extends TriggerPredicate<IBlockEventPredicate> {
}
export interface IBlockEventPredicate {
    srcPlayer?: PlayerPredicate;
    srcBlockState?: IBlockStatePredicate;
    block_at?: IBlockStateWithPosPredicate;
}
export declare class BlockStatePredicate extends TriggerPredicate<IBlockStatePredicate> {
}
export interface IBlockStatePredicate {
    has_tag?: string;
    has_param?: string | {
        param: string;
        value: string;
    };
    has_block_id?: string;
}
export declare class BlockStateWithPosPredicate extends TriggerPredicate<IBlockStateWithPosPredicate> {
}
export interface IBlockStateWithPosPredicate extends IBlockStatePredicate {
    xOff: number;
    yOff: number;
    zOff: number;
}
export declare class PlayerGamemodePredicate extends TriggerPredicate<IPlayerGamemodePredicate> {
}
export interface IPlayerGamemodePredicate {
    allows_items_drop_on_break: boolean;
}
export declare class PlayerPredicate extends TriggerPredicate<IPlayerPredicate> {
}
export interface IPlayerPredicate {
    gamemode: PlayerGamemodePredicate;
}
