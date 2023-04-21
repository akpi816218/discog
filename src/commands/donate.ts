import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	SlashCommandBuilder
} from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('donate')
	.setDescription('Support bot development! Please? Thank you!');

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.reply({
		components: [
			new ActionRowBuilder<ButtonBuilder>().setComponents(
				new ButtonBuilder()
					.setURL(
						'https://sry-but-not-accepting-donations-rn-but-tysm-anyway.com'
					)
					.setStyle(ButtonStyle.Link)
					.setLabel('Donate')
			)
		],
		content:
			'Please donate to support the development of this bot! Please? Please? Please? (Tysm if you alr did)'
	});
};
