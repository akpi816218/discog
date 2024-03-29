import {
	EmbedBuilder,
	Events,
	Message,
	channelMention,
	userMention
} from 'discord.js';
import { getGuildAuditLoggingChannel } from './a.getGuildConf';
export const name = Events.MessageUpdate;
export const once = false;

export const execute = async (old: Message, updated: Message) => {
	if (
		old.author.bot ||
		!old.inGuild() ||
		updated.author.bot ||
		!updated.inGuild()
	)
		return;
	await (
		await getGuildAuditLoggingChannel(updated.guild)
	)?.send({
		embeds: [
			new EmbedBuilder()
				.setTitle('Message Updated')
				.setDescription(updated.url)
				.setFields(
					{
						name: 'Author',
						value: userMention(updated.author.id)
					},
					{
						name: 'Channel',
						value: channelMention(updated.channel.id)
					},
					{
						name: 'Initial Content',
						value: old.content
					},
					{
						name: 'Updated Content',
						value: updated.content
					}
				)
				.setColor(0x0000ff)
				.setTimestamp()
				.setFooter({
					iconURL: updated.guild.members.me?.displayAvatarURL(),
					text: 'Powered by DisCog'
				})
		]
	});
};
