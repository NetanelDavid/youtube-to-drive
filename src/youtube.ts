import ytdl from 'ytdl-core';
import { Format, YoutubeInfo } from './types';
import { execAndLog } from './shared';

export async function getYoutubeInfo(videoLink: string, format: Format): Promise<YoutubeInfo> {
    const info = await execAndLog("Youtube info", () => ytdl.getInfo(videoLink));
    const { title } = info.videoDetails;

    const streamReadable = await execAndLog("Youtube stream", () => {
        return ytdl(videoLink, {
            filter: "mp4" === format ? (format) => format.container === "mp4"
                && format.hasAudio
                && format.hasVideo
                : "audioonly"
        });
    });

    return {
        name: title,
        streamReadable,
    }
}
