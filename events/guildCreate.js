'use strict';

const { Events } = require('discord.js');

module.exports = {
	name: Events.GuildCreate,
	once: false,
	/**
	 * @param {Guild} guild
	 */
	execute: async (guild) => {
		guild.systemChannel.send(
			new EmbedBuilder()
				.setColor(0x0f0)
				.setTitle('DisCog is here!')
				.setDescription(
					`DisCog is a general purpose Discord bot. Use ${inlineCode(
						'/coghelp'
					)} or view my profile to find out what I can do!`
				)
				.setTimestamp()
		);
	},
};
