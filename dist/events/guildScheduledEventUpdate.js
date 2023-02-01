import { Events } from 'discord.js';
export const name = Events.GuildScheduledEventDelete;
export const once = false;
export const execute = async (_oldevent, newevent) => {
	if (newevent.guild?.systemChannel)
		await newevent.guild.systemChannel.send(`Updated Event: ${newevent.url}`);
};
export default {
	execute,
	name,
	once
};
