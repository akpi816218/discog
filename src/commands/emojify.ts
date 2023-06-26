import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import translateToEmoji from 'translate-to-emoji';

export const data = new SlashCommandBuilder()
	.setName('emojify')
	.setDescription('Converts text to emojis')
	.addStringOption((option) => {
		return option
			.setName('text')
			.setDescription('Text to convert')
			.setRequired(true);
	})
	.addBooleanOption((option) => {
		return option
			.setName('ephemeral')
			.setDescription('Should the reply be ephemeral?')
			.setRequired(false);
	});

// ! Make sure to add command to `coghelp.ts`

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.reply({
		content: 'Converting...',
		ephemeral: interaction.options.getBoolean('ephemeral') ?? false
	});
	const text = interaction.options.getString('text') ?? '';
	await interaction.editReply(
		`Original: ${text}\nEmojified: ${translateToEmoji(text)}`
	);
};
