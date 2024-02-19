import qs from "qs";
import { Readable } from "stream";
import axios, { AxiosRequestConfig } from "axios";
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { AccessTotenResponse } from "./types";
import { execAndLog } from "./shared";
import { getSecret } from "./secretManager";

export class GoogleDriveClient {

	private generatotAccessToken: AsyncGenerator<string>;

	constructor() {
		this.generatotAccessToken = this.getAccessToket();
	}

	private async* getAccessToket(): AsyncGenerator<string> {
		let accessToken = "";
		let expiryTimeMS = 0;
		while (true) {
			if (!accessToken && Date.now() >= expiryTimeMS) {
				console.log("No access token valid, creating one");

				const credentials = await getSecret("GoogleDrive/Credentials");

				const config: AxiosRequestConfig = {
					method: "post",
					maxBodyLength: Infinity,
					url: "https://oauth2.googleapis.com/token",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					data: qs.stringify({
						client_id: credentials.GoogleDriveClientId,
						client_secret: credentials.GoogleDriveClientSecret,
						refresh_token: credentials.GoogleDriveRefereshToken,
						grant_type: "refresh_token",
					})
				};

				const { access_token, expires_in } = await execAndLog("Create Google token", async () => {
					return axios.request<AccessTotenResponse>(config).then((response) => response.data)
				});

				accessToken = access_token;
				expiryTimeMS = Date.now() + (expires_in * 1000);
			} else {
				console.log("Access token still valid");
			}
			yield accessToken;
		}
	}

	public async uploadFile(
		readableStream: Readable,
		mimeType: string,
		name: string
	): Promise<string> {
		const fileName = `${name}.${mimeType.split("/")[1]}`
		const accessToken = (await this.generatotAccessToken.next()).value;
		const auth = new OAuth2Client({
			credentials: {
				access_token: accessToken,
			}
		});
		const service = google.drive({ version: 'v3', auth });
		try {
			const file = await execAndLog("Google drive upload", () => service.files.create({
				requestBody: {
					name: fileName,
				},
				media: {
					mimeType,
					body: readableStream,
				},
				access_token: accessToken,
			}));
			const url = `https://drive.google.com/file/d/${file.data.id}/view`;
			return url;
		} catch (err) {
			// TODO(developer) - Handle error
			throw err;
		}
	}
}
