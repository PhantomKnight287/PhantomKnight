const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
require("dotenv").config();
const rest = new REST({ version: "9" }).setToken(process.env.token);

export const registerSlashCommands = async (
  commands: any[],
  isGlobal: Boolean
) => {
  try {
    if (isGlobal == true) {
      await rest.put(Routes.applicationCommands(process.env.clientId), {
        body: commands,
      });
    } else {
      await rest.put(
        Routes.applicationGuildCommands(
          process.env.clientId,
          process.env.guildId
        ),
        {
          body: commands,
        }
      );
    }
  } catch (error) {
    console.error(error);
  }
};
