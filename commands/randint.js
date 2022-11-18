import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
('use strict');
export const data = new SlashCommandBuilder()
	.setName('randint')
	.setDescription(
		'Generates an integer between 1 and a specified integer (inclusive)'
	)
	.addIntegerOption((option) => {
		return option
			.setName('high')
			.setDescription('The highest possible integer (inclusive)')
			.setRequired(true);
	});
/**
 *
 * @param {ChatInputCommandInteraction} interaction
 */
export const execute = async (interaction) => {
	let number;
	if (!interaction.options.getIntegerOption('high')) number = Math.random();
	else
		number = Math.round(
			Math.random() * interaction.options.getIntegerOption('high')
		);
	await interaction.reply(number);
};
export default {
	data,
	execute,
};
