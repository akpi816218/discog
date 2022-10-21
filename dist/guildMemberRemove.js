import * as discord from 'discord.js';
('use strict');
const { Events, userMention, GuildMember } = discord;
export const name = Events.GuildMemberRemove;
export const once = false;
export const execute = async (member) => {
	await member.guild.systemChannel.send(
		`${userMention(member.id)} just poofed.`
	);
};
export default {
	name,
	once,
	execute,
};
