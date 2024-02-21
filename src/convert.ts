import { Readable, PassThrough } from "stream";
// import { path } from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
import { Format } from "./types";
import { execAndLog } from "./shared";

// ffmpeg.setFfmpegPath(path);

export async function convert(streamReadable: Readable, format: Format): Promise<Readable> {
    return execAndLog(`Convert to ${format}`, () => {
        return ffmpeg(streamReadable)
            .toFormat(format)
            .pipe() as PassThrough
    });
}