import { getSecret } from "../../src/secretManager";

(async () => {
    const res = await getSecret("GoogleDrive/Credentials");
    console.log(res);
})();
