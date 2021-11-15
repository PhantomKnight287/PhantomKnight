const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
import colors from 'colors'
require('dotenv').config()
import type {command} from '../types'
const rest = new REST({ version: "9" }).setToken(process.env.token);

module.exports = async (commands, isGlobal) => {
  try {
    if (isGlobal == true) {
      await rest.put(Routes.applicationCommands(process.env.clientId), {
        body: commands,
      });
    } else {
      await rest.put(Routes.applicationGuildCommands(process.env.clientId,process.env.guildId), {
        body: commands,
      });
    }
    commands.forEach((command:command)=>{
      console.log(colors.cyan(`Successfully registered ${command.name} command`))
    })
  } catch (error) {
    console.error(error);
  }
};
