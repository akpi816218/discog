import { Events } from 'discord.js';
export const name = Events.GuildScheduledEventDelete;
export const once = false;
export const execute = async (event) => {
	if (event.guild?.systemChannel)
		await event.guild.systemChannel.send(`Deleted Event: ${event.url}`);
};
export default {
	execute,
	name,
	once
};
