'use strict';

const { EmbedBuilder, Events, userMention } = require('discord.js');

module.exports = {
	name: Events.GuildBanAdd,
	once: false,
	execute: async (ban) => {
		await ban.guild.systemChannel.send({
			embeds: [
				new EmbedBuilder()
					.setTitle('Ban Created')
					.setFields(
						{ name: 'User:', value: userMention(user.id) },
						{ name: 'Reason:', value: ban.reason }
					),
			],
		});
	},
};
