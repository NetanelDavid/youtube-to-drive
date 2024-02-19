import { Readable } from "stream";

export type Event = {
	playlist: string[];
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