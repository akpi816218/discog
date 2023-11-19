import { BaseInteraction, EmbedBuilder } from 'discord.js';

export function baseEmbed(interaction: BaseInteraction) {
	return new EmbedBuilder()
		.setFooter({
			iconURL: interaction.client.user.displayAvatarURL(),
			text: 'Powered by DisCog'
		})
		.setTimestamp()
		.setAuthor({
			iconURL: interaction.client.user.displayAvatarURL(),
			name: interaction.client.user.username,
			url: 'https://discog.localplayer.dev/'
		});
}
