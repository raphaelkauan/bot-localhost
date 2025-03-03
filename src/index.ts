import { Manager } from "moonlink.js";
import { CoreClient } from "./settings/core/CoreClient";

export const client = new CoreClient();
export let manager: Promise<Manager>;

client.start().then(() => {
  console.log("Bot iniciado com sucesso!");

  if (!client.user?.id) {
    throw new Error("Falha ao obter o ID do bot após o login.");
  }

  manager = client.initializerLavalink(client.user.id);
});
