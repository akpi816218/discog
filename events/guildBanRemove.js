import * as discord from 'discord.js';
('use strict');
const { EmbedBuilder, Events, userMention, GuildBan } = discord;
export const name = Events.GuildBanRemove;
export const once = false;
/**
 *
 * @param {GuildBan} ban
 */
export const execute = async (ban) => {
	await ban.guild.systemChannel.send(
		`${userMention(ban.user.id)} was unbanned.`
	);
};
export default {
	name,
	once,
	execute,
};
