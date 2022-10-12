const { SlashCommandBuilder } = require('discord.js');

// ! When creating a new command, be sure to add it to `coghelp.js` in both the general embed and specific switch statement.

module.exports = {
	data: new SlashCommandBuilder().setName('name').setDescription('description'),
	execute: async (interaction) => {
		await interaction.reply('reply message');
	},
};
