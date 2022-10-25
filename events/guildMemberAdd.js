import * as discord from 'discord.js';
('use strict');
const { Events, userMention, GuildMember } = discord;
export const name = Events.GuildMemberAdd;
export const once = false;
/**
 *
 * @param {GuildMember} member
 */
export const execute = async (member) => {
	if (member.guild.rulesChannel) {
		await member.guild.systemChannel.send(
			`Welcome to ${member.guild.name}, ${userMention(member.id)}! (Member #${
				member.guild.memberCount
			})`
		);
	}
};
export default {
	name,
	once,
	execute,
};
