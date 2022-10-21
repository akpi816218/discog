import * as discord from 'discord.js';
('use strict');
const {
	EmbedBuilder,
	Events,
	userMention,
	GuildScheduledEvent,
	channelMention,
} = discord;
export const name = Events.GuildScheduledEventDelete;
export const once = false;
export const execute = async (oldevent, newevent) => {
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
};
export default {
	name,
	once,
	execute,
};
