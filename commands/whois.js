'use strict';

const {
	EmbedBuilder,
	SlashCommandBuilder,
	userMention,
} = require('discord.js');

// ! When creating a new command, be sure to add it to `coghelp.js` in the `field` object.

module.exports = {
	data: new SlashCommandBuilder()
		.setName('whois')
		.setDescription('Who are they?')
		.setDMPermission(false)
		.addUserOption((option) => {
			return option.setName('user').setDescription('Who?').setRequired(true);
		}),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	execute: async (interaction, client) => {
		let user = await interaction.options.getUser('user').fetch(true);
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(user.hexAccentColor)
					.setTitle(`Who is ${userMention(user.id)}?`)
					.setThumbnail(user.displayAvatarUrl())
					.addFields(
						{ name: 'Tag:', value: user.tag },
						{ name: 'Join date:', value: user.createdAt().toLocaleString() },
						{ name: 'Banner Link:', value: user.bannerURL() },
						{ name: 'Is bot?', value: user.bot }
					)
					.setTimestamp()
					.setFooter({
						text: 'Powered by DisCog',
						iconURL: client.user.displayAvatarURL(),
					}),
			],
		});
	},
};
