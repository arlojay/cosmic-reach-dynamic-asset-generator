import { Mod } from "./mod";
export declare class Writer {
    private mod;
    private checkedFolders;
    minifyJson: boolean;
    constructor(mod: Mod, minifyJson?: boolean);
    private makePathToFile;
    private writeFile;
    write(modFolder: string, keepOldFolder?: boolean): void;
}
