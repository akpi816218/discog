'use strict';

const {
	EmbedBuilder,
	Events,
	userMention,
	GuildScheduledEvent,
	channelMention,
} = require('discord.js');

module.exports = {
	name: Events.GuildScheduledEventDelete,
	once: false,
	/**
	 * @param {GuildScheduledEvent} [oldevent]
	 * @param {GuildScheduledEvent} newevent
	 */
	execute: async (oldevent, newevent) => {
		await newevent.guild.systemChannel.send({
			embeds: [
				new EmbedBuilder().setTitle('Updated Event (Showing New)').setFields(
					{ name: 'Name:', value: newevent.name },
					{ name: 'Description:', value: newevent.description },
					{ name: 'Channel:', value: channelMention(newevent.channelId) },
					{
						name: 'Scheduled Start Time:',
						value: newevent.scheduledStartAt.toLocaleString(),
					},
					{
						name: 'Scheduled End Time:',
						value: newevent.scheduledEndAt.toLocaleString(),
					},
					{ name: 'Creator:', value: newevent.creator.tag },
					{ name: 'URL:', value: newevent.url },
					{ name: 'ID:', value: newevent.id }
				),
			],
		});
	},
};
