"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Audio = exports.AudioChannel = void 0;
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const stream_1 = require("stream");
const streamifier_1 = require("streamifier");
const util_1 = require("util");
const tempfile_1 = require("./tempfile");
class AudioChannel {
    samples;
    sampleRate;
    constructor(source, sampleRate) {
        this.samples = new Float32Array(source);
        this.sampleRate = sampleRate;
    }
    toBuffer() {
        return this.samples.buffer;
    }
    createStream() {
        return (0, streamifier_1.createReadStream)(new Uint8Array(this.toBuffer()));
    }
    extend(sampleCount) {
        const newSamples = new Float32Array(this.samples.length + sampleCount);
        newSamples.set(this.samples);
        this.samples = newSamples;
    }
    offset(sampleCount) {
        const newSamples = new Float32Array(this.samples.length + sampleCount);
        newSamples.set(this.samples, sampleCount);
        this.samples = newSamples;
    }
    amplify(coefficient) {
        for (let i = 0; i < this.samples.length; i++) {
            this.samples[i] *= coefficient;
        }
    }
    speed(coefficient) {
        this.sampleRate *= coefficient;
    }
    sample(index) {
        if (index < 0 || index >= this.samples.length)
            return 0;
        return this.samples[index];
    }
    set(index, sample) {
        if (index < 0)
            return;
        if (index >= this.samples.length) {
            this.extend(Math.ceil((this.samples.length - index + 1) / this.sampleRate) * this.sampleRate);
        }
        this.samples[index] = sample;
    }
    clone() {
        return new AudioChannel(this.toBuffer().slice(0), this.sampleRate);
    }
}
exports.AudioChannel = AudioChannel;
class Audio {
    channels;
    sampleRate;
    constructor(channels, sampleRate) {
        this.sampleRate = sampleRate;
        this.channels = channels.map(channel => new AudioChannel(channel, sampleRate));
    }
    clone() {
        return new Audio(this.channels.map(v => v.toBuffer().slice(0)), this.sampleRate);
    }
    toStream(type, codec) {
        const channelCount = this.channels.length;
        let command = (0, fluent_ffmpeg_1.default)();
        const tempFiles = new Array;
        for (let i = 0; i < channelCount; i++) {
            const channel = this.channels[i];
            const inputFile = new tempfile_1.TempFile(channel.toBuffer());
            tempFiles.push(inputFile);
            command = command.input(inputFile.name)
                .inputFormat("f32le")
                .inputOptions([
                "-ar", channel.sampleRate.toString(),
                "-ac", "1"
            ]);
            console.log("CHANNEL " + i + " SAMPLE RATE: " + channel.sampleRate);
        }
        const outputFile = new tempfile_1.TempFile;
        const outputStream = new stream_1.PassThrough;
        command = command.output(outputFile.name);
        if (channelCount == 2)
            command = command
                .outputOptions([
                "-filter_complex", "[0:a][1:a]amerge=inputs=2[stereo]",
                "-map", "[stereo]",
            ]);
        command = command
            .outputFormat(type)
            .outputOptions([
            "-ac", channelCount.toString(),
            "-ar", this.sampleRate.toString()
        ]);
        if (codec != null)
            command = command.audioCodec(codec);
        console.log("Writing audio");
        command = command
            .on("error", err => {
            outputStream.emit("error", new Error("ffmpeg encoding error: " + err.message, { cause: err }));
        })
            .on("end", () => {
            console.log("Reading audio");
            outputFile.createReadStream()
                .on("end", () => {
                console.log("Done reading audio");
                for (const tempFile of tempFiles)
                    tempFile.rm();
                outputFile.rm();
            })
                .pipe(outputStream);
        });
        command.run();
        console.log(command._getArguments().join(" "));
        return outputStream;
    }
    static async fromFile(data) {
        const pcm = await new Promise((res, rej) => {
            const input = (0, streamifier_1.createReadStream)(data);
            const chunks = new Array;
            const output = new stream_1.Writable({
                write(chunk, encoding, callback) {
                    chunks.push(chunk);
                    callback();
                },
            });
            (0, fluent_ffmpeg_1.default)(input)
                .audioCodec("pcm_f32le")
                .format("s16le")
                .on("stderr", data => console.error(data))
                .on("error", error => rej(new Error("ffmpeg decoding error: " + error.message, { cause: error })))
                .on("end", () => res(new Float32Array(Buffer.concat(chunks).buffer)))
                .pipe(output, { end: true });
        });
        const info = await new Promise((res, rej) => {
            (0, fluent_ffmpeg_1.default)((0, streamifier_1.createReadStream)(data))
                .ffprobe((error, info) => {
                if (error != null)
                    rej(new Error("ffprobe error: " + error.message, { cause: error }));
                if (info != null)
                    res(info);
            });
        });
        console.log((0, util_1.inspect)(info, false, 10));
        const audioChannel = info.streams.find(v => v.codec_type == "audio");
        const channelCount = audioChannel.channels;
        const channels = new Array(channelCount);
        if (channelCount != 1 && channelCount != 2)
            throw new Error("Audio file must be mono or stereo");
        for (let o = 0; o < channelCount; o++) {
            const channelData = new Float32Array(pcm.length / channelCount);
            for (let i = 0; i < channelData.length; i++) {
                channelData[i] = pcm[i * channelCount + o];
            }
            channels[o] = channelData.buffer;
        }
        const sampleRate = +audioChannel.sample_rate;
        return new Audio(channels, isNaN(sampleRate) ? 44100 : sampleRate);
    }
}
exports.Audio = Audio;
