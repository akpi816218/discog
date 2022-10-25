import { EmbedBuilder, Events, GuildScheduledEvent } from 'discord.js';
('use strict');
export const name = Events.GuildScheduledEventCreate;
export const once = false;
/**
 *
 * @param {GuildScheduledEvent} event
 */
export const execute = async (event) => {
	await event.guild.systemChannel.send(`New Event: ${event.url}`);
};
export default {
	name,
	once,
	execute,
};
