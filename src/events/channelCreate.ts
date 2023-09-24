import { EmbedBuilder, Events, GuildChannel, channelMention } from 'discord.js';
import { getGuildAuditLoggingChannel } from './a.getGuildConf';

export const name = Events.ChannelCreate;
export const once = false;

export const execute = async (channel: GuildChannel) => {
	await getGuildAuditLoggingChannel(channel.guild)?.send({
		embeds: [
			new EmbedBuilder()
				.setTitle('Channel Created')
				.setDescription(channelMention(channel.id))
				.setTimestamp()
				.setColor(0x00ff00)
				.setFooter({
					iconURL: channel.guild.members.me?.displayAvatarURL(),
					text: 'Powered by DisCog'
				})
		]
	});
};
