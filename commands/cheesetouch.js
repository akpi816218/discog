const { SlashCommandBuilder, userMention } = require('discord.js');
const { readFileSync, writeFileSync, write } = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cheesetouch')
		.setDescription('Transfer the cheesetouch')
		.addUserOption((option) => {
			return option
				.setName('user')
				.setDescription('The user to give the cheese touch to')
				.setRequired(true);
		}),
	execute: async (interaction) => {
		if (interaction.user.id == readFileSync(__dirname + '/cheesetouch.txt')) {
			writeFileSync(
				__dirname + '/cheesetouch.txt',
				interaction.options.getUser('user').id
			);
			await interaction.reply(
				`${userMention(
					interaction.user.id
				)} gave the cheese touch to ${userMention(
					interaction.options.getUser('user').id
				)}.`
			);
		} else {
			await interaction.reply(
				`${userMention(
					readFileSync(__dirname + '/cheesetouch.txt')
				)} has the cheese touch, not you.`
			);
		}
	},
};
