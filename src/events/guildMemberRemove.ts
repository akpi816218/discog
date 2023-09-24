import {
	EmbedBuilder,
	Events,
	GuildMember,
	NewsChannel,
	TextChannel,
	userMention
} from 'discord.js';
import { getGuildGreetingData } from './a.getGuildConf';
export const name = Events.GuildMemberRemove;
export const once = false;

export const execute = async (member: GuildMember) => {
	const config = getGuildGreetingData(member.guild);
	if (!config?.goodbyeEnabled) return;
	await (
		(await member.guild.channels.fetch(config.channel)) as
			| NewsChannel
			| TextChannel
			| undefined
	)?.send({
		embeds: [
			new EmbedBuilder()
				.setTitle('Member Left')
				.setDescription(
					`${userMention(member.id)}\n Now at ${
						(await member.guild.fetch()).memberCount
					} members`
				)
				.setColor(0xff0000)
				.setTimestamp()
				.setFooter({
					iconURL: member.guild.members.me?.displayAvatarURL(),
					text: 'Powered by DisCog'
				})
		]
	});
};
