import { Readable, PassThrough } from "stream";
import ffmpeg from "fluent-ffmpeg";
// import { StreamInput } from "fluent-ffmpeg-multistream";
import { Format } from "./types";
import { execAndLog } from "./shared";

if (!process.env.IS_CLOUD) {
    const { path } = require("@ffmpeg-installer/ffmpeg");
    ffmpeg.setFfmpegPath(path);
}

export async function convert(streamReadable: Readable, format: Format): Promise<Readable> {
    return execAndLog(`Convert to ${format}`, () => {
        return ffmpeg(streamReadable)
            .toFormat(format)
            .pipe() as PassThrough
    });
}

export async function merge(audioStreamReadable: Readable, vidoeStreamReadable: Readable) {
    return execAndLog(`Merge audio and vidoe`, () => {
        return ffmpeg()
            .addInput(vidoeStreamReadable)
            .addInput(audioStreamReadable)
            .pipe();
        // .outputOptions(['-map 0:v', '-map 1:a'])
        // .mergeToFile("test.mp4", __dirname);
    });
}