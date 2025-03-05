export declare class TempFile {
    filename: string;
    private static tempDir;
    private static setupTempDir;
    constructor(data?: ArrayBuffer);
    get name(): string;
    write(data: ArrayBuffer): void;
    createWriteStream(): import("fs").WriteStream;
    read(): ArrayBuffer;
    createReadStream(): import("fs").ReadStream;
    rm(): void;
    toString(): string;
}
