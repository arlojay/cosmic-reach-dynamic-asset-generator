# Cosmic Reach Dynamic Asset Generator
### The second generation of the "Cosmic Reach Modding API" for modern Cosmic Reach

[Cosmic Reach](https://finalforeach.itch.io/cosmic-reach) is a game developed by FinalForEach. I do not own any rights to assets in the game.

## Installation
If you want to quickly set up a new mod, [use this template](https://github.com/arlojay/cosmic-reach-dag-mod-template) (cosmic-reach-dag-mod-template on GitHub)

## Demo mod
Adds a stone breaker which runs on an interaction (only breaks stone)
```js
import { Texture, Mod, Writer, Directions, RunTriggerAction, BlockEventPredicate } from "../dist/index.js";

const mod = new Mod("test");
const block = mod.createBlock("stone_breaker");

for await(const enabled of [true, false]) {
    const state = block.createState("on=" + enabled);
    const model = state.createBlockModel();

    const cuboid = model.createCuboid();
    const enabledName = enabled ? "on" : "off";
    const side = await Texture.loadFromFile("stone-breaker-side-" + enabledName, "assets/testy-side-" + enabledName + ".png");
    const top = await Texture.loadFromFile("stone-breaker-top-" + enabledName, "assets/testy-top-" + enabledName + ".png");

    cuboid.north.texture = cuboid.east.texture = cuboid.south.texture = cuboid.west.texture = side;
    cuboid.up.texture = cuboid.down.texture = top;

    
    if(enabled) {
        const triggerSheet = state.createTriggerSheet();

        triggerSheet.setParent("base:block_events_default");

        block.defaultState = state;
        block.dropState = state;

        for(const direction of Directions.cardinals) {
            const trigger = new RunTriggerAction({
                xOff: direction.x,
                yOff: direction.y,
                zOff: direction.z,
                triggerId: "onBreak"
            });
            trigger.if(
                new BlockEventPredicate({
                    block_at: {
                        xOff: direction.x,
                        yOff: direction.y,
                        zOff: direction.z,
                        has_tag: "ore_replaceable"
                    }
                })
            );

            triggerSheet.addTrigger("onInteract", trigger);
        }
    } else {
        state.catalogHidden = true;
    }
}

const writer = new Writer(mod);
writer.write("./mod-demo/");
```