import {
	EmbedBuilder,
	Events,
	GuildMember,
	roleMention,
	userMention
} from 'discord.js';
import { getGuildAuditLoggingChannel } from './a.getGuildConf';

export const name = Events.GuildMemberUpdate;
export const once = false;
export const execute = async (before: GuildMember, after: GuildMember) => {
	const channel = await getGuildAuditLoggingChannel(after.guild);
	if (!channel) return;

	const embed = new EmbedBuilder()
			.setTitle('Member Updated')
			.setDescription(`${userMention(after.id)}`)
			.setColor(0xffff00)
			.setTimestamp()
			.setThumbnail(after.user.displayAvatarURL())
			.setFooter({
				iconURL: after.guild.members.me?.displayAvatarURL(),
				text: 'Powered by DisCog'
			}),
		differentProperties = getDifferentProperties(before, after);
	if (differentProperties.nickname)
		embed.addFields({
			name: 'Nickname',
			value: `${before.nickname} => ${after.nickname}`
		});
	if (differentProperties.roles)
		embed.addFields({
			name: 'Roles',
			value: `${before.roles.cache
				.map(r => roleMention(r.id))
				.join(', ')} => ${after.roles.cache
				.map(r => roleMention(r.id))
				.join(', ')}`
		});

	await channel.send({ embeds: [embed] });
};

function getDifferentProperties(before: GuildMember, after: GuildMember) {
	return Object.entries(after).reduce((diff, [key, value]) => {
		if (before[key as keyof GuildMember] !== value) {
			// @ts-expect-error Properties are not read-only at creation
			diff[key as keyof GuildMember] = value;
		}
		return diff;
	}, {} as Partial<GuildMember>);
}
