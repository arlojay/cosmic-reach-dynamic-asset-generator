import { PassThrough } from "stream";
export declare class AudioChannel {
    samples: Float32Array;
    sampleRate: number;
    constructor(source: ArrayBuffer, sampleRate: number);
    toBuffer(): ArrayBuffer;
    createStream(): import("stream").Readable;
    extend(sampleCount: number): void;
    offset(sampleCount: number): void;
    amplify(coefficient: number): void;
    speed(coefficient: number): void;
    sample(index: number): number;
    set(index: number, sample: number): void;
    clone(): AudioChannel;
}
export declare class Audio {
    channels: AudioChannel[];
    sampleRate: number;
    constructor(channels: ArrayBuffer[], sampleRate: number);
    clone(): Audio;
    toStream(type: string, codec?: string): PassThrough;
    static fromFile(data: Uint8Array): Promise<Audio>;
}
