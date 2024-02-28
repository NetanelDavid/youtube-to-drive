process.env.YTDL_NO_UPDATE = "true";

import { Readable } from "stream";
import PromisePool from "@supercharge/promise-pool";
import type { Handler } from "aws-lambda";
import { Event } from "./types";
import { GoogleDriveClient } from "./drive";
import { getYoutubeInfo, getYoutubeStream } from "./youtube";
import { execAndLog, getFileName } from "./shared";
import { download } from "./download";
import { convert, merge } from "./convert";

export const handler: Handler<Event> = async (event) => {
	console.log(`Starting with event: ${JSON.stringify(event, null, "\t")}\n`, `playlistLength: ${event.playlist?.length}`);

	const { playlist, playlistFormat, playlistAction, playlistQuality } = event;
	const googleDriveClient = new GoogleDriveClient();

	const { errors, results } = await execAndLog("Youtube to drive", () => PromisePool
		.for(playlist)
		.withConcurrency(3)
		.process(async ({ videoLink, videoAction, videoName, videoFormat, videoQuality }) => {
			const format = videoFormat || playlistFormat;
			const action = videoAction || playlistAction;
			const quality = videoQuality || playlistQuality;
			const youTubeInfo = await getYoutubeInfo(videoLink);

			let streamReadable: Readable;
			if ("mp4" === format && "high" === quality) {
				const [audio, video] = await Promise.all([
					getYoutubeStream(youTubeInfo, videoLink, "mp3", "high"),
					getYoutubeStream(youTubeInfo, videoLink, "mp4", "high"),
				]);
				streamReadable = await merge(audio, video);
			} else {
				streamReadable = await getYoutubeStream(youTubeInfo, videoLink, format, quality);
			}

			const name = videoName || youTubeInfo.videoDetails.title;
			const fileName = getFileName(`${name}.${format}`);

			const convertedStream = "mp3" === format ? await convert(streamReadable, format) : streamReadable;

			switch (action) {
				case "drive":
					return googleDriveClient.uploadFile(convertedStream, fileName);
				case "download":
					return download(convertedStream, fileName);
			}
		})
	);

	if (errors.length) {
		console.log(`Faild with ${errors.length} errors:`, errors);
	}

	console.log(`results: ${JSON.stringify(results)}`);

	if (results.length) {
		return results;
	}

	throw new Error("The proccess is faild, see logs for details")
}