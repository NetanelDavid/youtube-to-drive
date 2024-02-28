import { Readable } from "stream";
import ytdl from 'ytdl-core';
import { Format, Quality } from './types';
import { execAndLog } from './shared';

export function getMp3Filter(info: ytdl.videoInfo, quality: Quality): (format: ytdl.videoFormat) => boolean {
    const availableFormats = info.formats
        .filter((format) => format.hasAudio && !format.hasVideo)
        .sort((a, b) => Number(b.contentLength) - Number(a.contentLength));
    const contentLength = "high" === quality ? availableFormats[0].contentLength : availableFormats[availableFormats.length - 1].contentLength;

    return (format) => {
        return format.hasAudio && !format.hasVideo && contentLength === format.contentLength;
    }
}

export function getMp4Filter(info: ytdl.videoInfo, quality: Quality): (format: ytdl.videoFormat) => boolean {
    if ("low" === quality) {
        return (format) => {
            return format.hasAudio && format.hasVideo
        }
    } else {
        // return only video and will merge
        const availableFormats = info.formats
            .filter((format) => !format.hasAudio && format.hasVideo)
            .sort((a, b) => Number(b.contentLength) - Number(a.contentLength));
        const contentLength = availableFormats[0].contentLength;
        return (format) => {
            return !format.hasAudio && format.hasVideo && contentLength === format.contentLength;
        }
    }
}

export async function getYoutubeInfo(videoLink: string): Promise<ytdl.videoInfo> {
    const info = await execAndLog("Youtube info", () => ytdl.getInfo(videoLink));
    return info;
}

export async function getYoutubeStream(info: ytdl.videoInfo, videoLink: string, format: Format, quality: Quality): Promise<Readable> {
    const streamReadable = await execAndLog("Youtube stream", () => {
        return ytdl(videoLink, {
            filter: "mp4" === format
                ? getMp4Filter(info, quality)
                : getMp3Filter(info, quality),
        });
    });

    return streamReadable;
}
