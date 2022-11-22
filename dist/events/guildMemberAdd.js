('use strict');
import { Events, userMention } from 'discord.js';
export const name = Events.GuildMemberAdd;
export const once = false;
export const execute = async (member) => {
	if (member.guild.systemChannel)
		await member.guild.systemChannel.send(
			`Welcome to ${member.guild.name}, ${userMention(member.id)}! (Member #${
				member.guild.memberCount
			})`
		);
};
export default {
	name,
	once,
	execute,
};
