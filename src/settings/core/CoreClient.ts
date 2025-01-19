import {
  ApplicationCommandDataResolvable,
  BitFieldResolvable,
  Client,
  ClientEvents,
  Collection,
  GatewayIntentsString,
  IntentsBitField,
  Partials,
} from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { CommandType, ComponentsButton, ComponentsModal, ComponentsSelect } from "../types/Command";
import { EventType } from "../types/Event";

dotenv.config();

const fileCondition = (fileName: string) => fileName.endsWith(".ts") || fileName.endsWith(".js");

export class CoreClient extends Client {
  public commands: Collection<string, CommandType> = new Collection();
  public buttons: ComponentsButton = new Collection();
  public selects: ComponentsSelect = new Collection();
  public modals: ComponentsModal = new Collection();

  constructor() {
    super({
      intents: Object.keys(IntentsBitField.Flags) as BitFieldResolvable<GatewayIntentsString, number>,
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User,
      ],
    });
  }

  public start() {
    this.prepareCommands();
    this.registerEvents();
    this.login(process.env.BOT_TOKEN_DC);
  }

  private async registerCommands(commands: Array<ApplicationCommandDataResolvable>) {
    if (commands.length === 0) {
      console.error("no commands provided for registration!");
      return;
    }
    try {
      await this.application?.commands.set(commands);
      console.log(`successfully registered ${commands.length} slash command(s).`);
    } catch (error) {
      console.error(`an error occurred while registering slash commands! \n${error}`);
    }
  }

  private async prepareCommands() {
    const slashCommands: Array<ApplicationCommandDataResolvable> = new Array();

    const commandsPath = path.join(__dirname, "..", "..", "commands");

    try {
      const categoriesCommands = fs.readdirSync(commandsPath);

      await Promise.all(
        categoriesCommands.map(async (category) => {
          const categoryCommandsPath = path.join(commandsPath, category);
          const files = fs.readdirSync(categoryCommandsPath).filter(fileCondition);

          await Promise.all(
            files.map(async (file) => {
              try {
                const command: CommandType = (await import(`../../commands/${category}/${file}`))?.default;
                if (command.name) {
                  this.commands.set(command.name, command);
                  slashCommands.push(command);

                  command.buttons?.forEach((run, key) => this.buttons.set(key, run));
                  command.selects?.forEach((run, key) => this.selects.set(key, run));
                  command.modals?.forEach((run, key) => this.modals.set(key, run));
                }
              } catch (error) {
                console.error(`failed to load command from file: ${file} \n${error}`);
              }
            })
          );
        })
      );
      this.on("ready", () => this.registerCommands(slashCommands));
    } catch (error) {
      console.error(`failed while preparing commands! \n${error}`);
    }
  }

  private async registerEvents() {
    const eventsPath = path.join(__dirname, "../..", "events");

    try {
      const categoriesEvents = fs.readdirSync(eventsPath);

      await Promise.all(
        categoriesEvents.map(async (category) => {
          const categoryPath = path.join(eventsPath, category);
          const files = fs.readdirSync(categoryPath).filter(fileCondition);

          await Promise.all(
            files.map(async (file) => {
              try {
                const { name, once, run }: EventType<keyof ClientEvents> = (
                  await import(`../../events/${category}/${file}`)
                )?.default;

                if (name) once ? this.once(name, run) : this.on(name, run);
              } catch (error) {
                console.error(`failed to load event from file: ${file} \n${error}`);
              }
            })
          );
        })
      );
    } catch (error) {
      console.error(`failed while preparing events! \n${error}`);
    }
  }
}
