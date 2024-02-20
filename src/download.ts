import { path } from "@ffmpeg-installer/ffmpeg";
import ffmpeg from 'fluent-ffmpeg';
import { resolve } from "path";
import { Readable } from "stream";
import { mkdir } from "fs/promises";
import { execAndLog } from "./shared";

ffmpeg.setFfmpegPath(path);

export async function download(streamReadable: Readable, fileName: string) {
    const dirPath = resolve(__dirname, "..", "downloads");
    const filePath = resolve(dirPath, fileName);

    await mkdir(dirPath, { recursive: true });
    await execAndLog("Convert to mp3 and download", () => {
        return new Promise((res, rej) => {
            ffmpeg(streamReadable)
                .toFormat("mp3")
                .saveToFile(filePath)
                .on("end", res)
                .on("error", rej)
        })
    })
    return filePath;
}