"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerPredicate = exports.PlayerGamemodePredicate = exports.BlockStateWithPosPredicate = exports.BlockStatePredicate = exports.BlockEventPredicate = exports.LogicPredicate = exports.TriggerPredicate = void 0;
class TriggerPredicate {
    constructor(predicate) {
        Object.assign(this, predicate);
    }
}
exports.TriggerPredicate = TriggerPredicate;
class LogicPredicate extends TriggerPredicate {
    constructor(predicate) {
        if ("not" in predicate) {
            super({
                and: [{ not: predicate.not }, ...(predicate.and ?? [])]
            });
        }
        else {
            super(predicate);
        }
    }
}
exports.LogicPredicate = LogicPredicate;
class BlockEventPredicate extends TriggerPredicate {
}
exports.BlockEventPredicate = BlockEventPredicate;
class BlockStatePredicate extends TriggerPredicate {
}
exports.BlockStatePredicate = BlockStatePredicate;
class BlockStateWithPosPredicate extends TriggerPredicate {
}
exports.BlockStateWithPosPredicate = BlockStateWithPosPredicate;
class PlayerGamemodePredicate extends TriggerPredicate {
}
exports.PlayerGamemodePredicate = PlayerGamemodePredicate;
class PlayerPredicate extends TriggerPredicate {
}
exports.PlayerPredicate = PlayerPredicate;
