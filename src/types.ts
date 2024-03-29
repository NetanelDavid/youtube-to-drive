export type Action = "drive" | "download";
export type Format = "mp3" | "mp4";
export type Quality = "high" | "low";

export type Event = {
	playlist: {
		videoLink: string;
		videoName?: string;
		videoAction?: Action;
		vidoeFormat?: Format;
		vidoeQuality?: Quality;
	}[];
	playlisttAction: Action;
	palylistFormat: Format;
	playlistQuality: Quality;
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