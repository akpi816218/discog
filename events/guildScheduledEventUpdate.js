import * as discord from 'discord.js';
('use strict');
const {
	EmbedBuilder,
	Events,
	userMention,
	GuildScheduledEvent,
	channelMention,
} = discord;
export const name = Events.GuildScheduledEventDelete;
export const once = false;
export const execute = async (oldevent, newevent) => {
	await newevent.guild.systemChannel.send(`Updated Event: ${newevent.url}`);
};
export default {
	name,
	once,
	execute,
};
