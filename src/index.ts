import PromisePool from "@supercharge/promise-pool";
import type { Handler } from "aws-lambda";
import { Event } from "./types";
import { GoogleDriveClient } from "./drive";
import { getYoutubeInfo } from "./youtube";
import { execAndLog } from "./shared";
import { download } from "./download";
import { convert } from "./convert";

export const handler: Handler<Event> = async (event) => {
	console.log(`Starting with event: ${JSON.stringify(event)}`);

	const { playlist, action, format } = event;
	const googleDriveClient = new GoogleDriveClient();

	const { errors, results } = await execAndLog("Youtube to drive", () => PromisePool
		.for(playlist)
		.withConcurrency(3)
		.process(async (videoLink) => {
			const { name, streamReadable } = await getYoutubeInfo(videoLink, format);
			const mimeType = "mp3" === format ? "audio/mpeg" : "video/mp4";
			const fileName = (`${name}.${format}`).replace(/[/\\?%*:|"<>]/g, '-');

			const convertedStream = "mp3" === format ? await convert(streamReadable, format) : streamReadable;

			switch (action) {
				case "drive":
					return googleDriveClient.uploadFile(convertedStream, fileName, mimeType);
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