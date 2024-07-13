import { Client } from "eris";
import Bot from "../Bot";

export default {
  name: "disconnect",
  run: (bot: Client) => {
    Bot.log("😴 Bot is disconnected");
  },
};