const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
import colors from 'colors'
import type {command} from '../types'
const rest = new REST({ version: "9" }).setToken("ODM5ODQ5MTQyOTI1NjU2MDY0.YJPodw.cSBpT9IfQsVsN9ZoqmuhCF6fNMA");

module.exports = async (commands, isGlobal) => {
  try {
    if (isGlobal == true) {
      await rest.put(Routes.applicationCommands("839849142925656064"), {
        body: commands,
      });
    } else {
      await rest.put(Routes.applicationGuildCommands("839849142925656064","762220138321674240"), {
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