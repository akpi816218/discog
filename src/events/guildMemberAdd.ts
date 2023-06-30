import { Events, GuildMember, userMention } from 'discord.js';
export const name = Events.GuildMemberAdd;
export const once = false;

export const execute = async (member: GuildMember) => {
	if (member.guild.systemChannel)
		await member.guild.systemChannel.send(
			`Welcome to ${member.guild.name}, ${member.user.username} (${userMention(
				member.id
			)})! You are Member #${member.guild.memberCount}.`
		);
};
