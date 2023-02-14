import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder
} from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('ping')
	.setDescription("Check the bot's ping with Discord's servers");

export const execute = async (interaction: ChatInputCommandInteraction) => {
	const reply = await interaction.reply({
		content: 'Pinging...',
		fetchReply: true
	});
	reply.edit({
		embeds: [
			new EmbedBuilder().setTitle('DisCog Bot Ping').setFields(
				{
					name: 'WebSocket Heartbeat',
					value: interaction.client.ws.ping.toString()
				},
				{
					name: 'Roundtrip Latency',
					value: `${reply.createdTimestamp - interaction.createdTimestamp}ms`
				}
			)
		]
	});
};
export default {
	data,
	execute
};
