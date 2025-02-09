import { BlockState, SerializedBlockState } from "./blockState";
import { Identifier } from "./identifier";
import { Mod } from "./mod";

type BlockEntity = null;

export interface BlockProperties {
    fuelTicks: number | null;
}

export interface SerializedBlock {
    stringId: string;
    defaultProperties?: SerializedBlockState;
    blockStates: Record<string, SerializedBlockState>;
}

export class Block {
    public id: Identifier;
    private mod: Mod;

    public isOpaque: boolean = false;
    public tags: Set<string> = new Set;
    public properties: BlockProperties;

    public dropState: BlockState = null;
    public defaultState: BlockState = null;
    public fallbackParams: BlockState = null;
    
    private blockStates: Set<BlockState> = new Set;
    private blockEntity: BlockEntity | null = null;

    constructor(mod: Mod, id: Identifier) {
        this.id = id;
        this.mod = mod;
    }

    public createState(blockStateString: Map<string, string> | Record<string, string> | string | null): BlockState {
        const blockState = new BlockState(this.mod, this);
        if(this.dropState == null) this.dropState = blockState;
        if(this.defaultState == null) this.defaultState = blockState;
        
        this.blockStates.add(blockState);

        if(blockStateString != null) {
            if(blockStateString instanceof Map) {
                for(const [ key, value ] of blockStateString) {
                    blockState.params.set(key, value);
                }
            } else if(typeof blockStateString == "object") {
                for(const [ key, value ] of Object.entries(blockStateString)) {
                    blockState.params.set(key, value);
                }
            } else if(typeof blockStateString == "string") {
                for(const pair of blockStateString.split(",")) {
                    const [ key, value ] = pair.split("=");
                    blockState.params.set(key, value);
                }
            }
        }

        return blockState;
    }

    public createBlockEntity(): BlockEntity {
        throw new Error("Method not implemented");
    }

    public getStates() {
        return new Set(this.blockStates);
    }

    public serialize() {
        const blockStates: Record<string, SerializedBlockState> = {};

        for(const blockState of this.blockStates) {
            const blockStateId = blockState.compileParams();

            if(blockStateId in blockStates) throw new ReferenceError("Duplicate block state " + blockStateId);

            blockStates[blockStateId] = blockState.serialize();
        }

        const object: SerializedBlock = {
            stringId: this.id.toString(),
            blockStates
        };
        
        if(this.fallbackParams != null) object.defaultProperties = this.fallbackParams.serialize();

        return object;
    }
    
    public getBlockPath(): string {
        return "blocks/" + this.id.getItem() + ".json";
    }
    public getBlockId(): string {
        return this.id.toString();
    }
}