import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
('use strict');
export const data = new SlashCommandBuilder()
	.setName('name')
	.setDescription('description');
/**
 *
 * @param {ChatInputCommandInteraction} interaction
 */
export const execute = async (interaction) => {
	await interaction.reply('reply message');
};
export default {
	data,
	execute,
};
