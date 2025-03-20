import { Texture, Mod, Writer, Directions, RunTriggerAction, BlockEventPredicate } from "cosmic-reach-dag";

main();

async function main() {
    // Create the mod
    const mod = new Mod("test");

    // Our custom stone breaker block
    await createStoneBreaker(mod);

    // Compiles and writes the mod to a directory
    // (creates ./output/test/ for the mod content)
    const writer = new Writer(mod);
    writer.write("./output/");
}

async function createStoneBreaker(mod) {
    // Create and register our block with the mod
    const block = mod.createBlock("stone_breaker");

    /*
     # Add a state to the block
     The state ID can be a string, map, or object.
     In this case, we just want to make a single state.

     When a block has only a single state, calling it
     "default" is Cosmic Reach's convention.
    */
    const state = block.createState("default");

    /*
     # Create the state's model
     A state requires a block model. Without it, the game
     can't load the block.
     
     Block states do not come with a block model by
     default, so we would have to write our own.

     Thankfully, however, Cosmic Reach comes with a default
     block model which we can reference in a parent.
    */
    const model = state.createBlockModel();
    model.setParent("base:models/blocks/cube.json"); // new Identifier("base", "cube") also works here

    /*
     # Load the textures we want to use
     Subfolders are automatically created when the texture
     ID has a slash in the name.

     The second argument is the location of the file which
     will be parsed and eventually copied to the output
     directory.

     When used on a block, it will automatically put it
     in the /<mod>/textures/blocks/ directory.
     Vice versa for items.
    */
    const side = await Texture.loadFromFile("stone_breaker/side", "assets/stone-breaker-side.png");
    const end = await Texture.loadFromFile("stone_breaker/end", "assets/stone-breaker-end.png");

    /*
     # Set the texture overrides
     Block models have "texture slots" that tell the game
     which face should use which texture.

     When setting a parent, it's possible (and often
     required) to override its texture slots to get the
     look we want.
     */
    model.addTextureOverride(side, "side");
    model.addTextureOverride(end, "top");
    model.addTextureOverride(end, "bottom");

    /*
     # Creating the block events
     The name "trigger sheet" (an alias for block events)
     comes from the first version of this library.

     Triggers can be added here with sheet.addTrigger().

     Similarly to models, the game comes with default block
     events. If not specified, the block can't be placed.

     For sheets that override the default events (onBreak,
     and onPlace), use the library's boilerplate method
     `addDefaultEvents(triggerSheet)` to add back the
     defaults.
    */
    const triggerSheet = state.createTriggerSheet();
    triggerSheet.setParent("base:block_events_default");

    // Directions.cardinals is a list of NESW, up, and down `Direction`s
    // This will add a trigger for all six primary directions
    for(const direction of Directions.cardinals) {
        // Create the action (base:run_trigger)
        const action = new RunTriggerAction({
            xOff: direction.x,
            yOff: direction.y,
            zOff: direction.z,
            triggerId: "onBreak"
        });

        // Add an `if` block (checks if a block in the current direction is ore_replaceable)
        action.if(
            new BlockEventPredicate({
                block_at: {
                    xOff: direction.x,
                    yOff: direction.y,
                    zOff: direction.z,
                    has_tag: "ore_replaceable"
                }
            })
        );

        // When the block is interacted with, run the action
        triggerSheet.addTrigger("onInteract", action);
    }
}