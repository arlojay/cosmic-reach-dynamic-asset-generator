"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDefaultBreakEvents = addDefaultBreakEvents;
exports.addDefaultPlaceEvents = addDefaultPlaceEvents;
exports.addDefaultEvents = addDefaultEvents;
const triggerActions_1 = require("./triggerActions");
const triggerPredicates_1 = require("./triggerPredicates");
function addDefaultBreakEvents(sheet) {
    sheet.addTrigger("onBreak", new triggerActions_1.RunTriggerAction({
        triggerId: "relayPlayBreakSound"
    }), new triggerActions_1.ReplaceBlockStateAction({
        xOff: 0, yOff: 0, zOff: 0,
        blockStateId: "base:air[default]"
    }), new triggerActions_1.ItemDropAction({
        position: [0, 0, 0]
    })
        .if(new triggerPredicates_1.BlockEventPredicate({
        srcPlayer: new triggerPredicates_1.PlayerPredicate({
            gamemode: new triggerPredicates_1.PlayerGamemodePredicate({
                allows_items_drop_on_break: true
            })
        })
    })));
}
function addDefaultPlaceEvents(sheet) {
    sheet.addTrigger("onPlace", new triggerActions_1.ReplaceBlockStateAction({
        xOff: 0, yOff: 0, zOff: 0,
        blockStateId: "self"
    }), new triggerActions_1.RunTriggerAction({
        triggerId: "relayPlayPlaceSound"
    }));
}
function addDefaultEvents(sheet) {
    addDefaultBreakEvents(sheet);
    addDefaultPlaceEvents(sheet);
}
