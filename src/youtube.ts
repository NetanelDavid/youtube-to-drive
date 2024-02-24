import { writeFile } from "fs/promises";
import ytdl from 'ytdl-core';
import { Format, Quality } from './types';
import { execAndLog } from './shared';

export function getMp3Filter(info: ytdl.videoInfo, quality: Quality): (format: ytdl.videoFormat) => boolean {
    const availVableFormats = info.formats
        .filter((format) => format.hasAudio && !format.hasVideo)
        .sort((a, b) => Number(b.contentLength) - Number(a.contentLength));
    console.log(availVableFormats.map(f => (Number(f.contentLength) / 1024 / 1024) + "MB"));
    const contentLength = "high" === quality ? availVableFormats[0].contentLength : availVableFormats[availVableFormats.length - 1].contentLength;

    return (format) => {
        return format.hasAudio && !format.hasVideo && contentLength === format.contentLength;
    }
}

export function getMp4Filter(_info: ytdl.videoInfo, _quality: Quality): (format: ytdl.videoFormat) => boolean {
    return (format) => {
        return format.hasAudio && format.hasVideo
    }
}

export async function getYoutubeInfo(videoLink: string): Promise<ytdl.videoInfo> {
    const info = await execAndLog("Youtube info", () => ytdl.getInfo(videoLink));
    await writeFile(`${info.videoDetails.title.replace(/[/\\?%*:|"<>]/g, '-')}.json`, JSON.stringify(info, null, "\t"))
    return info;
}

export async function getYoutubeStream(videoLink: string, format: Format, quality: Quality, videoName?: string) {
    const info = await getYoutubeInfo(videoLink);
    const name = videoName || info.videoDetails.title;

    const streamReadable = await execAndLog("Youtube stream", () => {
        return ytdl(videoLink, {
            filter: "mp4" === format
                ? getMp4Filter(info, quality)
                : getMp3Filter(info, quality),
        });
    });

    return {
        name,
        streamReadable,
    }

}
