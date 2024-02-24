import PromisePool from "@supercharge/promise-pool";
import type { Handler } from "aws-lambda";
import { Event } from "./types";
import { GoogleDriveClient } from "./drive";
import { getYoutubeStream } from "./youtube";
import { execAndLog } from "./shared";
import { download } from "./download";
import { convert } from "./convert";

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
			const { name, streamReadable } = await getYoutubeStream(videoLink, format, qaulity, videoName);
			const fileName = (`${name}.${format}`).replace(/[/\\?%*:|"<>]/g, '-');

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