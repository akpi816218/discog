/* eslint-disable */
import {
	APIEmbedField,
	AuditLogEvent,
	BaseChannel,
	EmbedBuilder,
	Emoji,
	Events,
	Guild,
	GuildAuditLogsActionType,
	GuildAuditLogsEntry,
	GuildAuditLogsEntryExtraField,
	GuildBasedChannel,
	GuildScheduledEvent,
	Integration,
	Invite,
	Message,
	PartialDMChannel,
	PartialGroupDMChannel,
	PrivateThreadChannel,
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
	const embed = new EmbedBuilder()
			.setTitle(
				`Audit Log Entry | ${auditLogEventActionToReadableString(
					entry.action
				)} | ${entry.actionType}`
			)
			.setTimestamp(entry.createdTimestamp)
			.setColor(getEmbedColor(entry.actionType)),
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

	embed.addFields({
		name: 'Target',
		value: targetString
	});

	if (entry.executor) {
		embed.addFields({
			name: 'Executor',
			value: userMention(entry.executor.id)
		});
	}
};

function auditLogEventActionToReadableString(action: AuditLogEvent) {
	return AuditLogEvent[action];
}

function getEmbedColor(actionType: GuildAuditLogsActionType) {
	if (actionType === 'Create') return 0xff0000;
	else if (actionType === 'Delete') return 0x00ff00;
	else if (actionType === 'Update') return 0xffff00;
	else return 0x0000ff;
}

function getEventDetails(entry: GuildAuditLogsEntry): APIEmbedField[] {
	switch (entry.action) {
		case AuditLogEvent.ChannelCreate:
			return [
				{
					name: 'Name',
					value: (entry.extra as { name: string }).name
				}
			];
		case AuditLogEvent.ChannelDelete:
			return [
				{
					name: 'Name',
					value: (entry.target as GuildBasedChannel).name
				}
			];
		case AuditLogEvent.ChannelUpdate:
			const changes = entry.changes;
			const nameChangea = changes.find((change) => change.key === 'name');
			if (nameChangea) {
				return [
					{
						name: 'Name',
						value: `Changed from "${nameChangea.old}" to "${nameChangea.new}"`
					}
				];
			}
			return [];
		case AuditLogEvent.MemberRoleUpdate:
			const roleChanges = entry.changes as {
				key: string;
				old: string[];
				new: string[];
			}[];
			const addedRoles = roleChanges
				.filter((change) => change.key === '$add')
				.map((change) => `<@&${change.new}>`);
			const removedRoles = roleChanges
				.filter((change) => change.key === '$remove')
				.map((change) => `<@&${change.old}>`);
			return [
				{
					name: 'Added roles',
					value: addedRoles.join(', ')
				},
				{
					name: 'Removed roles',
					value: removedRoles.join(', ')
				}
			];
		case AuditLogEvent.MemberKick:
			return [
				{
					name: 'Reason',
					value: entry.reason ?? 'No reason provided'
				}
			];
		case AuditLogEvent.MemberBanAdd:
			return [
				{
					name: 'Reason',
					value: entry.reason ?? 'No reason provided'
				}
			];
		case AuditLogEvent.MemberUpdate:
			return [
				{
					name: 'Duration',
					value: (entry.extra as unknown as { duration: string }).duration
				},
				{
					name: 'Reason',
					value: entry.reason ?? 'No reason provided'
				}
			];
		case AuditLogEvent.GuildUpdate:
			const guildChanges = entry.changes as {
				key: string;
				old: any;
				new: any;
			}[];
			const nameChange = guildChanges.find((change) => change.key === 'name');
			const iconChange = guildChanges.find(
				(change) => change.key === 'iconHash'
			);
			const changesString = [];
			if (nameChange) {
				changesString.push(
					`Name changed from "${nameChange.old}" to "${nameChange.new}"`
				);
			}
			if (iconChange) {
				changesString.push('Icon changed');
			}
			return changesString.map((change) => ({
				name: 'Change',
				value: change
			}));
		default:
			return [];
	}
}
