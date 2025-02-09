import { Mod } from "./mod";
export declare class Writer {
    private mod;
    private checkedFolders;
    constructor(mod: Mod);
    private makePathToFile;
    private writeFile;
    write(modFolder: string, keepOldFolder?: boolean): void;
}
