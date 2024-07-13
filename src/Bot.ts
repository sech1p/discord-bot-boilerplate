import Eris, {
  Client,
  CommandInteraction,
  Constants,
  Message,
} from "eris";
import moment from "moment";
import glob from "glob-promise";
import path from "path";
import Config from "./Config";

const log: Function = (message: string) => console.log(`[${moment().format("YYYY-MM-DD HH:MM:ss")}] LOG: ${message}`);
const logError: Function = (message: string) => console.error(`[${moment().format("YYYY-MM-DD HH:MM:ss")}] ❌ ERROR: ${message}`);

const bot = Eris(Config.Token, {
  intents: [
    "guilds",
    "guildMembers",
    "guildMessages",
  ],
});

const loadEvents = (bot: Client) => {
  glob(`dist/events/*.js`)
    .then(async (eventFiles: string[]) => {
      log("⏳ Loading events...");
      for (const eventFile of eventFiles) {
        try {
          const { default: event } = await import(
            path.join(process.cwd(), eventFile)
          );
          
          if (typeof event.run === "function") {
            bot.on(event.name, event.run.bind(null, bot));
          } else {
            logError("Invalid event file, run function is missing");
          }
        } catch (exception: any) {
          logError(`An error has occured while loading event: ${exception}`);
        }
      }
    });
}

let commands: any[] = [];
const loadCommands = (bot: Client) => {
  glob(`dist/commands/**/*.js`)
    .then(async (commandFiles: string[]) => {
      log("⏳ Loading commands...");
      for (const commandFile of commandFiles) {
        try {
          // @ts-ignore
          const { default: command } = await import(
            path.join(process.cwd(), commandFile)
          );
          commands.push(command);
          
          bot.createCommand({
            name: command.name,
            description: command.description,
            options: command.options ?? [],
            type: Constants.ApplicationCommandTypes.CHAT_INPUT,
          });
        } catch (exception: any) {
          logError(`An error has occured while loading command: ${exception}`);
        }
      }
    }).finally(() => log("✅ Bot is ready!"));
}

bot.on("interactionCreate", async (interaction: CommandInteraction) => {
  try {
    const command = commands.find(
      command => command.name === interaction.data.name,
    );

    if (command) {
      await command.execute(interaction);
    }
  } catch (exception: any) {
    logError(`An error has occured while executing command: ${exception}`);
    return interaction.createMessage({
      content: "❌ An error has occured while executing command",
    });
  }
});

bot.on("ready", async () => {
  loadEvents(bot);
  loadCommands(bot);
});

bot.connect();

export default {
  log,
  logError,
};