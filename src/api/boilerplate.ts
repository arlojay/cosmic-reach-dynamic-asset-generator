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

import { Directions } from "./directions";
import { ItemDropAction, PlaySound2DAction, ReplaceBlockStateAction, RunTriggerAction, UpdateBlockAction } from "./triggerActions";
import { BlockEventPredicate, PlayerGamemodePredicate, PlayerPredicate } from "./triggerPredicates";
import { TriggerSheet } from "./triggerSheet";

export function addDefaultEvents(sheet: TriggerSheet) {
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
        })),
        new RunTriggerAction({ triggerId: "relayUpdateSurroundings" })
    );
    sheet.addTrigger("onPlace",
        new ReplaceBlockStateAction({
            xOff: 0, yOff: 0, zOff: 0,
            blockStateId: "self"
        }),
        new RunTriggerAction({
            triggerId: "relayPlayPlaceSound"
        }),
        new UpdateBlockAction(),
        new RunTriggerAction({ triggerId: "relayUpdateSurroundings" })
    );
    sheet.addTrigger("relayPlayBreakSound", new PlaySound2DAction({
        sound: "base:sounds/blocks/block-break.ogg",
        volume: 1,
        pitch: [ 0.9, 1.1 ],
        pan: 0
    }));
    sheet.addTrigger("relayPlayPlaceSound", new PlaySound2DAction({
        sound: "base:sounds/blocks/block-place.ogg",
        volume: 1,
        pitch: [ 0.9, 1.1 ],
        pan: 0
    }));
    for(const direction of Directions.cardinals) {
        sheet.addTrigger("relayUpdateSurroundings", new UpdateBlockAction({
            xOff: direction.x,
            yOff: direction.y,
            zOff: direction.z
        }));
    }
}