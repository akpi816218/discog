const { SlashCommandBuilder, userMention } = require('discord.js');
const { readFileSync, writeFileSync } = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('count')
		.setDescription('Increase the count!'),
	async execute(interaction) {
		let count = parseInt(readFileSync(__dirname + '/count.txt'));
		count++;
		writeFileSync(__dirname + '/count.txt', count.toString());
		await interaction.reply(
			`${userMention(interaction.user.id)} counted to ${count}!`
		);
	},
};
