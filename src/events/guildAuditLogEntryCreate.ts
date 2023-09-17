/* eslint-disable indent */
import {
	BaseChannel,
	EmbedBuilder,
	Emoji,
	Events,
	Guild,
	GuildAuditLogsEntry,
	GuildScheduledEvent,
	Integration,
	Invite,
	Message,
	Role,
	StageInstance,
	Sticker,
	User,
	Webhook,
	channelMention,
	hyperlink,
	parseWebhookURL,
	roleMention,
	userMention
} from 'discord.js';
import { BaseGuildConfig } from '../struct/database';
import { TypedJsoning } from 'typed-jsoning';

export const name = Events.GuildAuditLogEntryCreate;
export const once = false;

const db = new TypedJsoning<BaseGuildConfig>('botfiles/guildconf.db.json');
export const execute = async (entry: GuildAuditLogsEntry, guild: Guild) => {
	const config = db.get(guild.id);
	if (!config?.auditlog?.enabled || !config?.auditlog?.channel) return;
	const channel = await guild.channels.fetch(config.auditlog.channel);
	if (
		!channel ||
		!channel.isTextBased() ||
		channel.isVoiceBased() ||
		channel.isDMBased() ||
		channel.isThread()
	)
		return;
	const embed = new EmbedBuilder()
			.setTitle(`Audit Log Entry | ${entry.action} | ${entry.actionType}`)
			.setTimestamp(entry.createdTimestamp),
		target = entry.target;
	let targetString = '';
	if (target instanceof Guild) targetString = 'This server';
	else if (target instanceof BaseChannel)
		targetString = channelMention(target.id);
	else if (target instanceof User) targetString = userMention(target.id);
	else if (target instanceof Role) targetString = roleMention(target.id);
	else if (target instanceof Invite) targetString = target.url;
	else if (target instanceof Webhook)
		targetString = parseWebhookURL(target.url)?.id || 'Unknown Webhook';
	else if (target instanceof Emoji) targetString = target.toString();
	else if (target instanceof Message) targetString = target.url;
	else if (target instanceof Integration)
		targetString = target.user ? userMention(target.user.id) : target.name;
	else if (target instanceof StageInstance)
		targetString = `${channelMention(target.channelId)} — ${target.topic}`;
	else if (target instanceof Sticker) targetString = `Sticker: ${target.name}`;
	else if (target instanceof GuildScheduledEvent)
		targetString = hyperlink(target.name, new URL(target.url).toString());
	else return;
	embed.addFields(
		{
			name: 'Target',
			value: targetString
		},
		{
			name: 'Executor',
			value: entry.executor
				? userMention(entry.executor.id)
				: 'Unknown Executor'
		},
		{
			name: 'Reason',
			value: entry.reason || 'No reason provided'
		}
	);
};
