import { Readable } from "stream";

export type Action = "drive" | "download";
export type Format = "mp3" | "mp4";

export type Event = {
	playlist: string[];
	action: Action;
	format: Format;
}

export type YoutubeInfo = {
	name: string;
	streamReadable: Readable;
}

export type AccessTotenResponse = {
	access_token: string;
	expires_in: number;
	scope: string;
	token_type: "Bearer";
}

export type GoogleDriveCredentials = {
	GoogleDriveClientId: string;
	GoogleDriveClientSecret: string;
	GoogleDriveRefereshToken: string;
}