'use strict';

const { EmbedBuilder, Events, userMention, GuildBan } = require('discord.js');

module.exports = {
	name: Events.GuildBanRemove,
	once: false,
	/**
	 * @param {GuildBan} ban
	 */
	execute: async (ban) => {
		await ban.guild.systemChannel.send({
			embeds: [
				new EmbedBuilder()
					.setTitle('Ban Removed')
					.setFields(
						{ name: 'User:', value: userMention(user.id) },
						{ name: 'Reason:', value: ban.reason }
					),
			],
		});
	},
};
