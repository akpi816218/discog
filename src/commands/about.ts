import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder
} from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('about')
	.setDescription('About DisCog');

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.reply({
		components: [
			new ActionRowBuilder<ButtonBuilder>().setComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setURL('https://github.com/akpi816218/discog/commits/')
					.setLabel('Changelog'),
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setURL('https://discord.gg/7A7QwXVpsJ')
					.setLabel('Discord Server')
			)
		],
		embeds: [
			new EmbedBuilder()
				.setColor(0x00ff00)
				.setThumbnail(interaction.client.user.displayAvatarURL())
				.setAuthor({
					iconURL: interaction.client.user.displayAvatarURL(),
					name: 'DisCog'
				})
				.setTimestamp()
				.setFooter({
					iconURL: interaction.client.user.displayAvatarURL(),
					text: 'About DisCog'
				})
				.setTitle('About DisCog')
				.setDescription(
					'DisCog is a versatile general purpose Discord bot. DisCog features utility commands as well as some games and fun commands.'
				)
		]
	});
};
export default {
	data,
	execute
};
