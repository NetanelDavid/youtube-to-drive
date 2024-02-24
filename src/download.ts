import { join } from "path";
import { Readable } from "stream";
import { mkdir, writeFile } from "fs/promises";
import { execAndLog } from "./shared";

export async function download(streamReadable: Readable, fileName: string) {
    const dirPath = join(process.env.USERPROFILE as string, "Downloads");
    const filePath = join(dirPath, fileName);

    await mkdir(dirPath, { recursive: true });
    await execAndLog("Download", () => writeFile(filePath, streamReadable))
    return filePath;
}