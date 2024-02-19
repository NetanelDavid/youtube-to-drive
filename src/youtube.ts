import ytdl from 'ytdl-core';
import { Action, YoutubeInfo } from './types';
import { execAndLog } from './shared';

export async function getYoutubeInfo(videoLink: string, action: Action): Promise<YoutubeInfo> {
    const info = await execAndLog("Youtube info", () => ytdl.getInfo(videoLink));
    const { title } = info.videoDetails;

    const streamReadable = await execAndLog("Youtube stream", () => {
        return ytdl(videoLink, {
            filter: "Drive" === action ? (format) => format.container === "mp4"
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
