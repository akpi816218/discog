import {
	ChannelType,
	ChatInputCommandInteraction,
	NewsChannel,
	PrivateThreadChannel,
	PublicThreadChannel,
	SlashCommandBuilder,
	StageChannel,
	TextChannel,
	ThreadChannel,
	time
} from 'discord.js';
import { scheduleJob } from 'node-schedule';

export const data = new SlashCommandBuilder()
	.setName('schedule')
	.setDescription('Schedules a message')
	.addStringOption((option) =>
		option
			.setName('message')
			.setDescription('The message to be scheduled')
			.setMinLength(10)
			.setMaxLength(2000)
			.setRequired(true)
	)
	.addIntegerOption((option) =>
		option
			.setName('time')
			.setDescription('When to schedule the message (minutes)')
			.setRequired(true)
	)
	.addChannelOption((option) =>
		option
			.setName('channel')
			.setDescription('The channel the message should be sent to')
			.addChannelTypes(ChannelType.GuildText)
			.setRequired(true)
	);

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.deferReply();
	const channel = interaction.options.getChannel('channel', true) as
			| NewsChannel
			| StageChannel
			| TextChannel
			| ThreadChannel
			| PrivateThreadChannel
			| PublicThreadChannel,
		message = interaction.options.getString('message', true),
		t = interaction.options.getInteger('time', true) * 60 * 1_000;
	const date = new Date(new Date().getTime() + t);
	scheduleJob(date, async () => {
		await channel.send(message);
	});
	await interaction.reply({
		content: `Your message has been scheduled for ${time(date.getSeconds())}`
	});
};
