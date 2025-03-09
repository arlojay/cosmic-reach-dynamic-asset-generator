import { BlockModel } from "./blockModel";
import { BlockState, SerializedBlockState } from "./blockState";
import { Identifier } from "./identifier";
import { Mod } from "./mod";

export interface SerializedBlockStateGenerator {
    stringId: string;
    include?: string[];
    modelName?: string;
    params?: Record<string, string>;
    overrides?: Partial<SerializedBlockState>;
}

export abstract class BlockStateGeneratorEntry {
    public id: Identifier;
    public parent: BlockStateGenerator;
    
    public constructor(id: Identifier, parent: BlockStateGenerator) {
        this.id = id;
        this.parent = parent;
    }
    
    public abstract serialize(): SerializedBlockStateGenerator;
}

export class BasicBlockStateGeneratorEntry extends BlockStateGeneratorEntry {
    public model: BlockModel | Identifier | string;
    public params: Record<string, string> = {};
    public overrides: Partial<SerializedBlockState>;

    public serialize(): SerializedBlockStateGenerator {
        const overridesClone = Object.assign({}, this.overrides);
        delete overridesClone.modelName;

        const object: SerializedBlockStateGenerator = {
            stringId: this.id.toString().replace(/\//g, "•"),
            params: this.params,
            overrides: overridesClone
        };

        if(this.model != null) {
            if(this.model instanceof BlockModel) this.model = this.model.id;
            if(this.model instanceof Identifier) this.model = this.model.toString();
            object.modelName = this.model;
        }


        return object;
    }
}

export class TemplatedBlockStateGeneratorEntry extends BlockStateGeneratorEntry {
    public state: BlockState;

    constructor(state: BlockState, parent: BlockStateGenerator) {
        const block = state.getBlock();
        const id = parent.id.derive(block.id.getItem() + "/" + state.compileParams("-", "_"));

        super(id, parent);
        this.state = state;
    }

    public serialize(): SerializedBlockStateGenerator {
        const overrides = this.state.serialize();
        delete overrides.modelName;

        const object: SerializedBlockStateGenerator = {
            stringId: this.id.toString(),
            params: Object.fromEntries(this.state.params), overrides
        };

        if(this.state.model != null) {
            object.modelName = this.state.model.getBlockModelId().toString();
        }


        return object;
    }
}

export class BlockStateGeneratorGroupEntry extends BlockStateGeneratorEntry {
    public includes: Set<BlockStateGeneratorEntry | Identifier | string> = new Set;

    public addIncludes(...includes: (BlockStateGeneratorEntry | Identifier | string)[]) {
        for(const include of includes) {
            this.includes.add(include);
        }
    }

    public serialize(): SerializedBlockStateGenerator {
        return {
            stringId: this.id.toString().replace(/\//g, "•"),
            include: Array.from(this.includes).map(include => {
                if(include instanceof Identifier) {
                    return include.toString();
                }
                if(include instanceof BlockStateGeneratorEntry) {
                    return include.id.toString();
                }
                return include;
            })
        };
    }
}

export class BlockStateGenerator {
    public id: Identifier;
    public generators: Set<BlockStateGeneratorEntry> = new Set;

    public constructor(id: Identifier) {
        this.id = id;
    }

    public createBasicGenerator(id: string) {
        const generator = new BasicBlockStateGeneratorEntry(this.id.derive(id), this);
        this.generators.add(generator);
        return generator;
    }

    public createTemplatedGenerator(state: BlockState) {
        const generator = new TemplatedBlockStateGeneratorEntry(state, this);
        this.generators.add(generator);
        return generator;
    }

    public createGroup(id: string, ...includes: (BlockStateGeneratorEntry | Identifier | string)[]) {
        const generator = new BlockStateGeneratorGroupEntry(this.id.derive(id), this);
        generator.addIncludes(...includes);
        this.generators.add(generator);
        return generator;
    }

    public serialize() {
        const object = {
            generators: Array.from(this.generators).map(generator => generator.serialize())
        }

        return object;
    }

    public getBlockStateGeneratorPath() {
        return "block_state_generators/" + this.id.getItem() + ".json";
    }
    public getBlockStateGeneratorId() {
        return this.id.toString().replace(/\//g, "•");
    }
}