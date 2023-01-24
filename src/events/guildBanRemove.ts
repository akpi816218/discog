('use strict');
import {
	EmbedBuilder,
	Events,
	userMention,
	GuildBan,
	inlineCode,
} from 'discord.js';
export const name = Events.GuildBanRemove;
export const once = false;

export const execute = async (ban: GuildBan) => {
	if (ban.guild.systemChannel)
		await ban.guild.systemChannel.send(
			`${inlineCode(ban.user.tag)} (${userMention(ban.user.id)}) was unbanned.`
		);
};
export default {
	name,
	once,
	execute,
};
