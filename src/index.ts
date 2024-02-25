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

	const { playlist, palylistFormat, playlisttAction, playlistQuality } = event;
	const googleDriveClient = new GoogleDriveClient();

	const { errors, results } = await execAndLog("Youtube to drive", () => PromisePool
		.for(playlist)
		.withConcurrency(3)
		.process(async ({ videoLink, videoAction, videoName, vidoeFormat, vidoeQuality }) => {
			const format = vidoeFormat || palylistFormat;
			const action = videoAction || playlisttAction;
			const qaulity = vidoeQuality || playlistQuality;
			const youTubeInfo = await getYoutubeInfo(videoLink);

			let name: string;
			let streamReadable: Readable;
			if ("mp4" === format && "high" === qaulity) {
				const [audio, video] = await Promise.all([
					getYoutubeStream(youTubeInfo, videoLink, "mp3", "high"),
					getYoutubeStream(youTubeInfo, videoLink, "mp4", "high"),
				]);
				name = audio.name;
				await download(video.streamReadable, `${video.name}.mp4`)
				await download(audio.streamReadable, `${audio.name}.mp3`)
				// streamReadable = await merge(audio.streamReadable, video.streamReadable);
			} else {
				const youtubeStream = await getYoutubeStream(youTubeInfo, videoLink, format, qaulity, videoName);
				name = youtubeStream.name;
				streamReadable = youtubeStream.streamReadable;
			}
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