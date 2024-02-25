import { writeFile } from "fs/promises";
import ytdl from 'ytdl-core';
import { Format, Quality } from './types';
import { execAndLog } from './shared';

export function getMp3Filter(info: ytdl.videoInfo, quality: Quality): (format: ytdl.videoFormat) => boolean {
    const availVableFormats = info.formats
        .filter((format) => format.hasAudio && !format.hasVideo)
        .sort((a, b) => Number(b.contentLength) - Number(a.contentLength));
    const contentLength = "high" === quality ? availVableFormats[0].contentLength : availVableFormats[availVableFormats.length - 1].contentLength;

    return (format) => {
        return format.hasAudio && !format.hasVideo && contentLength === format.contentLength;
    }
}

export function getMp4LowFilter(info: ytdl.videoInfo, quality: Quality): (format: ytdl.videoFormat) => boolean {
    if ("low" === quality) {
        return (format) => {
            return format.hasAudio && format.hasVideo
        }
    } else {
        // return only video and will merge
        const availVableFormats = info.formats
            .filter((format) => !format.hasAudio && format.hasVideo)
            .sort((a, b) => Number(b.contentLength) - Number(a.contentLength));
        const contentLength = availVableFormats[0].contentLength;
        return (format) => {
            return !format.hasAudio && format.hasVideo && contentLength === format.contentLength;
        }
    }
}

export async function getYoutubeInfo(videoLink: string): Promise<ytdl.videoInfo> {
    const info = await execAndLog("Youtube info", () => ytdl.getInfo(videoLink));
    await writeFile(`${info.videoDetails.title.replace(/[/\\?%*:|"<>]/g, '-')}.json`, JSON.stringify(info, null, "\t"))
    return info;
}

export async function getYoutubeStream(info: ytdl.videoInfo, videoLink: string, format: Format, quality: Quality, videoName?: string) {
    const name = videoName || info.videoDetails.title;

    const streamReadable = await execAndLog("Youtube stream", () => {
        return ytdl(videoLink, {
            quality: ""
            filter: "mp4" === format
                ? getMp4LowFilter(info, quality)
                : getMp3Filter(info, quality),
        });
    });

    return {
        name,
        streamReadable,
    }
}
