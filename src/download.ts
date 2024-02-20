import { resolve } from "path";
import { Readable } from "stream";
import { mkdir, writeFile } from "fs/promises";
import { execAndLog } from "./shared";

export async function download(streamReadable: Readable, fileName: string) {
    const dirPath = resolve(__dirname, "..", "downloads");
    const filePath = resolve(dirPath, fileName);

    await mkdir(dirPath, { recursive: true });
    await execAndLog("Download", () => writeFile(filePath, streamReadable))
    return filePath;
}