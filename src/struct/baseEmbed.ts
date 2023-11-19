import { EmbedBuilder, GuildMember, User } from 'discord.js';

export function baseEmbed(user: User | GuildMember) {
	if (user instanceof GuildMember) user = user.user;
	return new EmbedBuilder()
		.setFooter({
			iconURL: user.displayAvatarURL(),
			text: 'Powered by DisCog'
		})
		.setTimestamp()
		.setAuthor({
			iconURL: user.displayAvatarURL(),
			name: user.username,
			url: 'https://discog.localplayer.dev/'
		});
}
