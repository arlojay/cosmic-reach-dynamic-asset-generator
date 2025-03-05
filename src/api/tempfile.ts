import crypto from "node:crypto";
import path from "node:path";
import os from "node:os";
import { createReadStream, createWriteStream, mkdirSync, readFileSync, rmdirSync, rmSync, unlinkSync, writeFileSync } from "node:fs";

export class TempFile {
    public filename: string;

    private static tempDir: string;
    private static setupTempDir() {
        if(this.tempDir != null) return;

        this.tempDir = path.resolve(path.join(os.tmpdir(), "crdagtemp_" + crypto.randomUUID()));
        mkdirSync(this.tempDir);

        process.addListener("beforeExit", () => {
            console.log("rm dir ", this.tempDir);
            // rmSync(this.tempDir, { recursive: true, force: true });
        })
    }

    constructor(data?: ArrayBuffer) {
        TempFile.setupTempDir();

        this.filename = path.join(TempFile.tempDir, crypto.randomUUID());

        if(data != null) this.write(data);
    }

    public get name() {
        return this.filename;
    }

    public write(data: ArrayBuffer) {
        writeFileSync(this.filename, Buffer.from(data));
    }
    public createWriteStream() {
        return createWriteStream(this.filename);
    }
    public read(): ArrayBuffer {
        return readFileSync(this.filename).buffer as ArrayBuffer;
    }
    public createReadStream() {
        return createReadStream(this.filename);
    }

    public rm() {
        console.log("rm " + this.filename);
        // rmSync(this.filename, { force: true });
    }

    public toString() {
        return this.filename;
    }
}