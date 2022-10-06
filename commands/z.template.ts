const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('name').setDescription('description'),
	execute: async (interaction) => {
		await interaction.reply('reply message');
	},
};
