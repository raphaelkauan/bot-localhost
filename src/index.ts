import { CoreClient } from "./settings/core/CoreClient";
import { LavalinkClient } from "./settings/core/LavalinkClient";

export const client = new CoreClient();
export let manager: ReturnType<typeof LavalinkClient>;

client.start().then(() => {
  console.log("Bot iniciado com sucesso!");

  if (!client.user?.id) {
    throw new Error("Falha ao obter o ID do bot após o login.");
  }

  client.initializerLavalink(client.user.id);
});
