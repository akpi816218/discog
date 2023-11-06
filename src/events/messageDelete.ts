import {
	EmbedBuilder,
	Events,
	Message,
	channelMention,
	userMention
} from 'discord.js';
import { getGuildAuditLoggingChannel } from './a.getGuildConf';
export const name = Events.MessageDelete;
export const once = false;

export const execute = async (message: Message) => {
	if (!message.inGuild()) return;
	const channel = getGuildAuditLoggingChannel(message.guild);
	if (!channel) return;
	await channel.send({
		embeds: [
			new EmbedBuilder()
				.setTitle('Message Deleted')
				.setFields(
					{
						name: 'Author',
						value: userMention(message.author.id)
					},
					{
						name: 'Channel',
						value: channelMention(message.channel.id)
					},
					{
						name: 'Content',
						value: message.content
					}
				)
				.setColor(0x0000ff)
				.setTimestamp()
				.setFooter({
					iconURL: message.guild.members.me?.displayAvatarURL(),
					text: 'Powered by DisCog'
				})
		]
	});
};
