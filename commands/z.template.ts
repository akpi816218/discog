'use strict';

import { ChatInputCommandInteraction } from 'discord.js';

const { SlashCommandBuilder } = require('discord.js');

// ! When creating a new command, be sure to add it to `coghelp.js` in the `field` object.

module.exports = {
	data: new SlashCommandBuilder().setName('name').setDescription('description'),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	execute: async (interaction, client) => {
		await interaction.reply('reply message');
	},
};
