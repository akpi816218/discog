const { SlashCommandBuilder, userMention, bold } = require('discord.js');
const Jsoning = require('jsoning');
const db = new Jsoning('main.db.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cheesetouch')
		.setDescription('Transfer the cheesetouch')
		.addUserOption((option) => {
			return option
				.setName('user')
				.setDescription('The user to give the cheese touch to')
				.setRequired(true);
		})
		.addBooleanOption((option) => {
			return option
				.setName('force')
				.setDescription("This won't work unless you own the bot")
				.setRequired(false);
		}),
	execute: async (interaction) => {
		if (!interaction.options.getBoolean('force', false)) {
			if (interaction.user.id == db.get('cheesetouch')) {
				await db.set('cheesetouch', interaction.options.getUser('user').id);
				await interaction.reply(
					`${userMention(
						interaction.user.id
					)} gave the cheese touch to ${userMention(
						interaction.options.getUser('user').id
					)}.`
				);
			} else {
				await interaction.reply(
					`${userMention(db.get('cheesetouch'))} has the cheese touch, not you.`
				);
			}
		} else if (
			[
				'1006248060629811301' /* akpi */,
				'817214551740776479' /* akhilzebra */,
			].includes(interaction.user.id)
		) {
			await db.set('cheesetouch', interaction.options.getUser('user').id);
			await interaction.reply(
				`${userMention(interaction.user.id)} ${bold(
					'forcefully'
				)} gave the cheese touch to ${userMention(
					interaction.options.getUser('user').id
				)}.`
			);
		} else {
			await interaction.reply(
				'You do not have the permission to use this command in this way.'
			);
		}
	},
};
