import * as discord from 'discord.js';
('use strict');
const { EmbedBuilder, Events, userMention, GuildBan } = discord;
export const name = Events.GuildBanAdd;
export const once = false;
/**
 *
 * @param {GuildBan} ban
 */
export const execute = async (ban) => {
	await ban.guild.systemChannel.send({
		embeds: [
			new EmbedBuilder()
				.setTitle('Ban Created')
				.setFields(
					{ name: 'User:', value: userMention(ban.user.id) },
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
