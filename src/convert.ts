import { Readable, PassThrough, Writable } from "stream";
import ffmpeg from "fluent-ffmpeg";
import { path } from "@ffmpeg-installer/ffmpeg";
import cp from "child_process";
import { Format } from "./types";
import { execAndLog } from "./shared";

if (!process.env.IS_CLOUD) {
    ffmpeg.setFfmpegPath(path);
}

export async function convert(streamReadable: Readable, format: Format): Promise<Readable> {
    return execAndLog(`Convert to ${format}`, () => {
        return ffmpeg(streamReadable)
            .toFormat(format)
            .pipe() as PassThrough
    });
}

export async function merge(audioStreamReadable: Readable, videoStreamReadable: Readable): Promise<Readable> {
    return execAndLog("Merge Audio and video", () => {
        const ffmpegProcess = cp.spawn(process.env.IS_CLOUD ? "ffmpeg" : path, [
            '-i', `pipe:3`,
            '-i', `pipe:4`,
            '-map', '0:v',
            '-map', '1:a',
            '-c:v', 'copy',
            '-c:a', 'copy',
            '-crf', '27',
            '-preset', 'veryfast',
            '-movflags', 'frag_keyframe+empty_moov',
            '-f', 'mp4',
            '-loglevel', 'error',
            '-'
        ], {
            stdio: [
                'pipe', 'pipe', 'pipe', 'pipe', 'pipe',
            ],
        });

        videoStreamReadable.pipe(ffmpegProcess.stdio[3] as Writable);
        audioStreamReadable.pipe(ffmpegProcess.stdio[4] as Writable);

        let ffmpegLogs = ''

        ffmpegProcess.stdio[2].on(
            'data',
            (chunk) => { ffmpegLogs += chunk.toString() }
        )

        ffmpegProcess.on(
            'exit',
            (exitCode) => {
                if (exitCode === 1) {
                    console.error(ffmpegLogs)
                }
            }
        )
        return ffmpegProcess.stdio[1];
    });
}