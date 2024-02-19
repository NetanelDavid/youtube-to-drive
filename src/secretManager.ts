import assert from "assert";
import {
    SecretsManagerClient,
    GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { GoogleDriveCredentials } from "./types";
import { execAndLog } from "./shared";

const secretManagmentClient = new SecretsManagerClient({
    region: "us-east-2",
});

export async function getSecret(secretName: string): Promise<GoogleDriveCredentials> {
    try {

        const response = await execAndLog("Fetch secret",
            () => secretManagmentClient.send(
                new GetSecretValueCommand({
                    SecretId: secretName,
                    VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
                })
            )
        );
        const { SecretString } = response;
        assert(SecretString, `secret ${secretName} not found`);

        const credentials: GoogleDriveCredentials = JSON.parse(SecretString);
        return credentials;
    } catch (error) {
        throw error;
    }
}




// Your code goes here