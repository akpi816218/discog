import {
	ChannelType,
	EmbedBuilder,
	Events,
	GuildChannel,
	OverwriteType,
	channelMention,
	roleMention,
	userMention
} from 'discord.js';
import { BaseGuildConfig } from '../struct/database';
import TypedJsoning from 'typed-jsoning';

export const name = Events.ChannelDelete;
export const once = false;

const db = new TypedJsoning<BaseGuildConfig>('botfiles/guildconf.db.json');
export const execute = async (channel: GuildChannel) => {
	const config = db.get(channel.guild.id);
	if (!config?.auditlog?.enabled || !config?.auditlog?.channel) return;
	const auditlogChannel = channel.guild.channels.cache.get(
		config.auditlog.channel
	);
	if (!auditlogChannel || !auditlogChannel.isTextBased()) return;
	await auditlogChannel.send({
		embeds: [
			new EmbedBuilder()
				.setTitle('Channel Deleted')
				.setDescription(channelMention(channel.id))
				.setFields(
					{
						name: 'Channel Type',
						value: ChannelType[channel.type]
					},
					{
						name: 'Permissions',
						value: channel.permissionOverwrites.cache
							.map(
								(overwrite) =>
									`${
										overwrite.type === OverwriteType.Role
											? roleMention(overwrite.id)
											: userMention(overwrite.id)
									}\n${overwrite.allow.toArray().join(', ')} \n${overwrite.deny
										.toArray()
										.join(', ')}`
							)
							.join('\n')
					}
				)
				.setTimestamp()
				.setColor(0xff0000)
		]
	});
};
