import { Events, GuildScheduledEvent } from 'discord.js';
import { getGuildAuditLoggingChannel } from './a.getGuildConf';

export const name = Events.GuildScheduledEventCreate;
export const once = false;

export const execute = async (event: GuildScheduledEvent) => {
	await getGuildAuditLoggingChannel(event.guild!)?.send(
		`Event Created: ${event.url}`
	);
};
