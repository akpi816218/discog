import { Events, GuildScheduledEvent } from 'discord.js';
import { getGuildAuditLoggingChannel } from './a.getGuildConf';
export const name = Events.GuildScheduledEventDelete;
export const once = false;

export const execute = async (
	_oldevent: GuildScheduledEvent,
	newevent: GuildScheduledEvent
) => {
	await getGuildAuditLoggingChannel(newevent.guild!)?.send(
		`Updated Event: ${newevent.url}`
	);
};
