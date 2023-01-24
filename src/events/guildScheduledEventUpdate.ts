import * as discord from 'discord.js';
('use strict');
import { Events, GuildScheduledEvent } from 'discord.js';
export const name = Events.GuildScheduledEventDelete;
export const once = false;

export const execute = async (
	_oldevent: GuildScheduledEvent,
	newevent: GuildScheduledEvent
) => {
	if (newevent.guild?.systemChannel)
		await newevent.guild.systemChannel.send(`Updated Event: ${newevent.url}`);
};
export default {
	name,
	once,
	execute,
};
