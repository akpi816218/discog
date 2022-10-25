import * as discord from 'discord.js';
('use strict');
const { Events } = discord;
export const name = Events.GuildScheduledEventDelete;
export const once = false;
export const execute = async (event) => {
	await event.guild.systemChannel.send(`Deleted Event: ${event.url}`);
};
export default {
	name,
	once,
	execute,
};
