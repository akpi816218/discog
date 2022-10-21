import * as discord from 'discord.js';
('use strict');
const {
	EmbedBuilder,
	Events,
	userMention,
	GuildScheduledEvent,
	channelMention,
} = discord;
export const name = Events.GuildScheduledEventCreate;
export const once = false;
export const execute = async (event) => {
	await event.guild.systemChannel.send({
		embeds: [
			new EmbedBuilder().setTitle('New Event').setFields(
				{ name: 'Name:', value: event.name },
				{ name: 'Description:', value: event.description },
				{ name: 'Channel:', value: channelMention(event.channelId) },
				{
					name: 'Scheduled Start Time:',
					value: event.scheduledStartAt.toLocaleString(),
				},
				{
					name: 'Scheduled End Time:',
					value: event.scheduledEndAt.toLocaleString(),
				},
				{ name: 'Creator:', value: event.creator.tag },
				{ name: 'URL:', value: event.url },
				{ name: 'ID:', value: event.id }
			),
		],
	});
};
export default {
	name,
	once,
	execute,
};
