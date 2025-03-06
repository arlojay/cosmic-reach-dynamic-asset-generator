import ffmpeg, { FfprobeData } from "fluent-ffmpeg";
import { PassThrough, Writable } from "stream";
import { createReadStream } from "streamifier";
import { inspect } from "util";
import { TempFile } from "./tempfile";

export class AudioChannel {
    public samples: Float32Array;
    public sampleRate: number;

    constructor(source: ArrayBuffer, sampleRate: number) {
        this.samples = new Float32Array(source);
        this.sampleRate = sampleRate;
    }
    public toBuffer() {
        return this.samples.buffer as ArrayBuffer;
    }
    public createStream() {
        return createReadStream(new Uint8Array(this.toBuffer()));
    }

    public extend(sampleCount: number) {
        const newSamples = new Float32Array(this.samples.length + sampleCount);
        newSamples.set(this.samples);
        this.samples = newSamples;
    }
    public offset(sampleCount: number) {
        const newSamples = new Float32Array(this.samples.length + sampleCount);
        newSamples.set(this.samples, sampleCount);
        this.samples = newSamples;
    }
    public amplify(coefficient: number) {
        for(let i = 0; i < this.samples.length; i++) {
            this.samples[i] *= coefficient;
        }
    }
    public speed(coefficient: number) {
        this.sampleRate *= coefficient;
    }
    public sample(index: number) {
        if(index < 0 || index >= this.samples.length) return 0;
        return this.samples[index];
    }
    public set(index: number, sample: number) {
        if(index < 0) return;
        if(index >= this.samples.length) {
            this.extend(Math.ceil((this.samples.length - index + 1) / this.sampleRate) * this.sampleRate);
        }
        this.samples[index] = sample;
    }
    public clone() {
        return new AudioChannel(this.toBuffer().slice(0), this.sampleRate);
    }
}

export class Audio {
    public channels: AudioChannel[];
    public sampleRate: number;

    constructor(channels: ArrayBuffer[], sampleRate: number) {
        this.sampleRate = sampleRate;
        this.channels = channels.map(channel => new AudioChannel(channel, sampleRate));
    }

    public clone() {
        return new Audio(this.channels.map(v => v.toBuffer().slice(0)), this.sampleRate);
    }

    public toStream(type: string, codec?: string) {
        const channelCount = this.channels.length;
    
        let command = ffmpeg();
        const tempFiles: TempFile[] = new Array;

        for(let i = 0; i < channelCount; i++) {
            const channel = this.channels[i];

            const inputFile = new TempFile(channel.toBuffer());
            tempFiles.push(inputFile);

            command = command.input(inputFile.name)
                .inputFormat("f32le")
                .inputOptions([
                    "-ar", channel.sampleRate.toString(),
                    "-ac", "1"
                ])
        }


        const outputFile = new TempFile;
        const outputStream = new PassThrough;
        command = command.output(outputFile.name);

        if(channelCount == 2) command = command
            .outputOptions([
                "-filter_complex", "[0:a][1:a]amerge=inputs=2[stereo]",
                "-map", "[stereo]",
            ]);

            command = command
            .outputFormat(type)
            .outputOptions([
                "-ac", channelCount.toString(),
                "-ar", this.sampleRate.toString()
            ])

        if(codec != null) command = command.audioCodec(codec);

        command = command
            .on("error", err => {
                outputStream.emit("error", new Error("ffmpeg encoding error: " + err.message, { cause: err }));
            })
            .on("end", () => {
                outputFile.createReadStream()
                    .on("end", () => {
                        for(const tempFile of tempFiles) tempFile.rm();
                        outputFile.rm();
                    })
                    .pipe(outputStream);
            });
        
        command.run();

        return outputStream;
    }

    public static async fromFile(data: Uint8Array) {
        const pcm = await new Promise<Float32Array>((res, rej) => {
            const input = createReadStream(data);

            const chunks: Uint8Array[] = new Array;            
            const output = new Writable({
                write(chunk, encoding, callback) {
                    chunks.push(chunk);
                    callback();
                },
            });


            ffmpeg(input)
                .audioCodec("pcm_f32le")
                .format("s16le")
                .on("stderr", data => console.error(data))
                .on("error", error => rej(new Error("ffmpeg decoding error: " + error.message, { cause: error })))
                .on("end", () => res(new Float32Array(Buffer.concat(chunks).buffer)))
                .pipe(output, { end: true });
        });

        const info = await new Promise<FfprobeData>((res, rej) => {
            ffmpeg(createReadStream(data))
                .ffprobe((error, info) => {
                    if(error != null) rej(new Error("ffprobe error: " + error.message, { cause: error }));
                    if(info != null) res(info);
                })
        });

        const audioChannel = info.streams.find(v => v.codec_type == "audio");
        const channelCount = audioChannel.channels;
        const channels = new Array<ArrayBuffer>(channelCount);

        if(channelCount != 1 && channelCount != 2) throw new Error("Audio file must be mono or stereo");

        for(let o = 0; o < channelCount; o++) {
            const channelData = new Float32Array(pcm.length / channelCount);
            for(let i = 0; i < channelData.length; i++) {
                channelData[i] = pcm[i * channelCount + o];
            }
            channels[o] = channelData.buffer;
        }

        
        const sampleRate = +audioChannel.sample_rate;
        return new Audio(
            channels,
            isNaN(sampleRate) ? 44100 : sampleRate
        );
    }
}