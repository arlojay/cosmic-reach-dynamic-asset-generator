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