import * as discord from 'discord.js';
('use strict');
const { EmbedBuilder, Events, userMention, GuildBan } = discord;
export const name = Events.GuildBanRemove;
export const once = false;
export const execute = async (ban) => {
	await ban.guild.systemChannel.send({
		embeds: [
			new EmbedBuilder()
				.setTitle('Ban Removed')
				.setFields(
					{ name: 'User:', value: userMention(user.id) },
					{ name: 'Reason:', value: ban.reason }
				),
		],
	});
};
export default {
	name,
	once,
	execute,
};
