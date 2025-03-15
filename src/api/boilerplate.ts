import { Directions } from "./directions";
import { ItemDropAction, ReplaceBlockStateAction, RunTriggerAction, UpdateBlockAction } from "./triggerActions";
import { BlockEventPredicate, PlayerGamemodePredicate, PlayerPredicate } from "./triggerPredicates";
import { TriggerSheet } from "./triggerSheet";

export function addDefaultBreakEvents(sheet: TriggerSheet) {
    sheet.addTrigger("onBreak",
        new RunTriggerAction({
            triggerId: "relayPlayBreakSound"
        }),
        new ReplaceBlockStateAction({
            xOff: 0, yOff: 0, zOff: 0,
            blockStateId: "base:air[default]"
        }),
        new ItemDropAction({
            position: [ 0, 0, 0 ]
        })
        .if(new BlockEventPredicate({
            srcPlayer: new PlayerPredicate({
                gamemode: new PlayerGamemodePredicate({
                    allows_items_drop_on_break: true
                })
            })
        }))
    );

    for(const direction of Directions.cardinals) {
        sheet.addTrigger("onBreak",
            new UpdateBlockAction({ xOff: direction.x, yOff: direction.y, zOff: direction.z })
        );
    }
}
export function addDefaultPlaceEvents(sheet: TriggerSheet) {
    sheet.addTrigger("onPlace",
        new ReplaceBlockStateAction({
            xOff: 0, yOff: 0, zOff: 0,
            blockStateId: "self"
        }),
        new RunTriggerAction({
            triggerId: "relayPlayPlaceSound"
        }),
        new UpdateBlockAction()
    );
    for(const direction of Directions.cardinals) {
        sheet.addTrigger("onPlace",
            new UpdateBlockAction({ xOff: direction.x, yOff: direction.y, zOff: direction.z })
        );
    }
}

export function addDefaultEvents(sheet: TriggerSheet) {
    addDefaultBreakEvents(sheet);
    addDefaultPlaceEvents(sheet);
}