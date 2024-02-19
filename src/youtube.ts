import ytdl from 'ytdl-core';
import { YoutubeInfo } from './types';
import { execAndLog } from './shared';

export async function getYoutubeInfo(videoLink: string): Promise<YoutubeInfo> {
    const info = await execAndLog("Youtube info", () => ytdl.getInfo(videoLink));
    const { title } = info.videoDetails;

    const streamReadable = await execAndLog("Youtube stream", () => {
        return ytdl(videoLink, {
            filter: (format) => format.container === "mp4"
                && format.hasAudio
                && format.hasVideo

        });
    });

    return {
        name: title,
        streamReadable,
    }
}
