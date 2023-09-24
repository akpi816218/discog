import { EmbedBuilder, Events, GuildChannel, channelMention } from 'discord.js';
import { BaseGuildConfig } from '../struct/database';
import TypedJsoning from 'typed-jsoning';

export const name = Events.ChannelCreate;
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
				.setTitle('Channel Created')
				.setDescription(channelMention(channel.id))
				.setTimestamp()
				.setColor(0x00ff00)
		]
	});
};
