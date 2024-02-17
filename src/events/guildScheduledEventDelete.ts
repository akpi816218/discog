import { Events, GuildScheduledEvent } from 'discord.js';
import { getGuildAuditLoggingChannel } from './a.getGuildConf';
export const name = Events.GuildScheduledEventDelete;
export const once = false;

export const execute = async (event: GuildScheduledEvent) => {
	await (
		await getGuildAuditLoggingChannel(event.guild!)
	)?.send(`Event Deleted: ${event.url}`);
};
