import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	ModalBuilder,
	SlashCommandBuilder,
	TextInputBuilder,
	TextInputStyle,
} from 'discord.js';
('use strict');
export const data = new SlashCommandBuilder()
	.setName('contact')
	.setDescription('Send an email to the developers');

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.showModal(
		new ModalBuilder()
			.setTitle('DisCog Developer Contact Form')
			.setCustomId('/contact')
			.setComponents(
				new ActionRowBuilder<TextInputBuilder>().setComponents(
					new TextInputBuilder()
						.setCustomId('/contact.text')
						.setLabel('Message')
						.setPlaceholder('The message to send')
						.setStyle(TextInputStyle.Paragraph)
				)
			)
	);
};
export default {
	data,
	execute,
};
