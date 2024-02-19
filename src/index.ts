import PromisePool from "@supercharge/promise-pool";
import type { Handler } from "aws-lambda";
import { Event } from "./types";
import { GoogleDriveClient } from "./drive";
import { getYoutubeInfo } from "./youtube";
import { execAndLog } from "./shared";
import { download } from "./download";


export const handler: Handler<Event> = async (event) => {
	console.log(`Starting with event: ${JSON.stringify(event)}`);

	const { playlist, action } = event;
	const googleDriveClient = new GoogleDriveClient();

	const { errors, results } = await execAndLog("Youtube to drive", () => PromisePool
		.for(playlist)
		.withConcurrency(50)
		.process(async (videoLink) => {
			const { name, streamReadable } = await getYoutubeInfo(videoLink, action);
			const mimeType = "Download" === action ? "audio/mpeg" : "video/mp4";
			const fileName = ("Download" === action ? `${name}.mp3` : `${name}.mp4`).replace(/[/\\?%*:|"<>]/g, '-');
			switch (action) {
				case "Drive":
					return googleDriveClient.uploadFile(streamReadable, fileName, mimeType);
				case "Download":
					return download(streamReadable, fileName);
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