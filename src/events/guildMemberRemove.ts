import { Events, GuildMember, userMention } from 'discord.js';
export const name = Events.GuildMemberRemove;
export const once = false;

export const execute = async (member: GuildMember) => {
	if (member.guild.systemChannel)
		await member.guild.systemChannel.send(
			`${member.user.tag} (${userMention(member.id)}) just poofed.`
		);
};
export default {
	execute,
	name,
	once
};
