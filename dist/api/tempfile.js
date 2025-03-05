"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TempFile = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const node_path_1 = __importDefault(require("node:path"));
const node_os_1 = __importDefault(require("node:os"));
const node_fs_1 = require("node:fs");
class TempFile {
    filename;
    static tempDir;
    static setupTempDir() {
        if (this.tempDir != null)
            return;
        this.tempDir = node_path_1.default.resolve(node_path_1.default.join(node_os_1.default.tmpdir(), "crdagtemp_" + node_crypto_1.default.randomUUID()));
        (0, node_fs_1.mkdirSync)(this.tempDir);
        process.addListener("beforeExit", () => {
            console.log("rm dir ", this.tempDir);
            // rmSync(this.tempDir, { recursive: true, force: true });
        });
    }
    constructor(data) {
        TempFile.setupTempDir();
        this.filename = node_path_1.default.join(TempFile.tempDir, node_crypto_1.default.randomUUID());
        if (data != null)
            this.write(data);
    }
    get name() {
        return this.filename;
    }
    write(data) {
        (0, node_fs_1.writeFileSync)(this.filename, Buffer.from(data));
    }
    createWriteStream() {
        return (0, node_fs_1.createWriteStream)(this.filename);
    }
    read() {
        return (0, node_fs_1.readFileSync)(this.filename).buffer;
    }
    createReadStream() {
        return (0, node_fs_1.createReadStream)(this.filename);
    }
    rm() {
        console.log("rm " + this.filename);
        // rmSync(this.filename, { force: true });
    }
    toString() {
        return this.filename;
    }
}
exports.TempFile = TempFile;
