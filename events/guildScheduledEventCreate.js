'use strict';

const {
	EmbedBuilder,
	Events,
	userMention,
	GuildScheduledEvent,
	channelMention,
} = require('discord.js');

module.exports = {
	name: Events.GuildScheduledEventCreate,
	once: false,
	/**
	 * @param {GuildScheduledEvent} event
	 */
	execute: async (event) => {
		await event.guild.systemChannel.send({
			embeds: [
				new EmbedBuilder()
					.setTitle('New Event')
					.setFields(
						{ name: 'Name:', value: event.name },
						{ name: 'Description:', value: event.description },
						{ name: 'Channel:', value: channelMention(event.channelId) },
						{ name: 'Scheduled Start Time:', value: event.scheduledStartAt.toLocaleString() },
						{ name: 'Scheduled End Time:', value: event.scheduledEndAt.toLocaleString() },
						{ name: 'Creator:', value: event.creator.tag },
						{ name: 'URL:', value: event.url },
						{ name: 'ID:', value: event.id }
					),
			],
		});
	},
};
