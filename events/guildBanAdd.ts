('use strict');
import {
	EmbedBuilder,
	Events,
	userMention,
	GuildBan,
	APIEmbedField,
} from 'discord.js';
export const name = Events.GuildBanAdd;
export const once = false;

export const execute = async (ban: GuildBan) => {
	if (ban.guild.systemChannel)
		await ban.guild.systemChannel.send({
			embeds: [
				new EmbedBuilder()
					.setTitle('Ban Created')
					.setFields(
						{ name: 'User:', value: userMention(ban.user.id) } as APIEmbedField,
						{ name: 'Reason:', value: ban.reason } as APIEmbedField
					),
			],
		});
};
export default {
	name,
	once,
	execute,
};
