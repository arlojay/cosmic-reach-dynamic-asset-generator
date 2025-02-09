"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerGamemodePredicate = exports.BlockStateWithPosPredicate = exports.BlockStatePredicate = exports.BlockEventPredicate = exports.LogicPredicate = exports.TriggerPredicate = void 0;
class TriggerPredicate {
    constructor(predicate) {
        Object.assign(this, predicate);
    }
}
exports.TriggerPredicate = TriggerPredicate;
class LogicPredicate extends TriggerPredicate {
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
//# sourceMappingURL=triggerPredicates.js.map