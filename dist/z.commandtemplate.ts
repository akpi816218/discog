import * as discord from 'discord.js';
('use strict');
const { SlashCommandBuilder } = discord;
export const data = new SlashCommandBuilder()
	.setName('name')
	.setDescription('description');
export const execute = async (interaction, client) => {
	await interaction.reply('reply message');
};
export default {
	data,
	execute,
};
