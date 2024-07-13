import { CommandInteraction } from "eris";

export default {
  name: "hello",
  description: "A description of a command",
  options: [],
  execute: async (interaction: CommandInteraction) => {
    return interaction.createMessage("Hello, world!");
  },
};