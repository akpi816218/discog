'use strict';

const { bold, SlashCommandBuilder, userMention } = require('discord.js');
const Jsoning = require('jsoning');
const db = new Jsoning('main.db.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('count')
		.setDescription('Increase the count!')
		.setDMPermission(true),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		let count = parseInt(db.get('count'));
		count++;
		db.set('count', count);
		await interaction.reply(
			`${userMention(interaction.user.id)} counted to ${bold(count)}!`
		);
	},
};
