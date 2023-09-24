import { BaseGuildConfig } from '../struct/database';
import { Guild } from 'discord.js';
import TypedJsoning from 'typed-jsoning';

const db = new TypedJsoning<BaseGuildConfig>('botfiles/guildconf.db.json');

export function getGuildAuditLoggingChannel(guild: Guild) {
	const config = db.get(guild.id);
	if (!config?.auditlog?.enabled || !config?.auditlog?.channel) return;
	const auditlogChannel = guild.channels.cache.get(config.auditlog.channel);
	if (!auditlogChannel || !auditlogChannel.isTextBased()) return;
	return auditlogChannel;
}

export function getGuildGreetingData(guild: Guild) {
	const config = db.get(guild.id);
	if (
		config?.greetings?.channel ||
		(!config?.greetings?.goodbyeEnabled && !config?.greetings?.welcomeEnabled)
	)
		return;
	return config.greetings;
}
