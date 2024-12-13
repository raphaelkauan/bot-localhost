import { CoreClient } from "./settings/core/CoreClient";

const client = new CoreClient();
client.start();

export { client };
