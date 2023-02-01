import {
	EmbedBuilder,
	Events,
	GuildBan,
	inlineCode,
	userMention
} from 'discord.js';
export const name = Events.GuildBanAdd;
export const once = false;

export const execute = async (ban: GuildBan) => {
	if (ban.guild.systemChannel)
		await ban.guild.systemChannel.send({
			embeds: [
				new EmbedBuilder().setTitle('Ban Created').setFields(
					{
						name: 'User:',
						value: `${ban.user.tag} (${userMention(ban.user.id)})`
					},
					{
						name: 'Reason:',
						value: ban.reason || inlineCode('No reason provided')
					}
				)
			]
		});
};
export default {
	execute,
	name,
	once
};
