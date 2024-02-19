import PromisePool from "@supercharge/promise-pool";
import type { Handler } from "aws-lambda";
import { Event } from "./types";
import { GoogleDriveClient } from "./drive";
import { getYoutubeInfo } from "./youtube";
import { execAndLog } from "./shared";


async function youtubeToDriveProccess(videoLink: string, googleDriveClient: GoogleDriveClient): Promise<string> {
	const { name, streamReadable } = await getYoutubeInfo(videoLink);
	return googleDriveClient.uploadFile(streamReadable, "video/mp4", name)
}

export const handler: Handler<Event> = async (event) => {
	console.log(`Starting with event: ${JSON.stringify(event)}`);

	const { playlist } = event;
	const googleDriveClient = new GoogleDriveClient();

	const { errors, results } = await execAndLog("Youtube to drive", () => PromisePool
		.for(playlist)
		.withConcurrency(50)
		.process((videoLink) => {
			return youtubeToDriveProccess(videoLink, googleDriveClient)
		})
	);

	if (errors.length) {
		console.log(`Faild with ${errors.length} errors:`, errors);
	}

	console.log(`results: ${JSON.stringify(results)}`);

	return results;
}