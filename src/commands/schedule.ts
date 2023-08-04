import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	ModalBuilder,
	SlashCommandBuilder,
	TextInputBuilder,
	TextInputStyle
} from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('schedule')
	.setDescription('Schedules a message')
	.setDMPermission(true);

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.showModal(
		new ModalBuilder()
			.setTitle('Message Scheduler')
			.setCustomId('/schedule')
			.setComponents(
				new ActionRowBuilder<TextInputBuilder>().setComponents(
					new TextInputBuilder()
						.setCustomId('/schedule.channel')
						.setValue(interaction.channelId)
						.setRequired(true)
						.setMinLength(17)
						.setMaxLength(19)
						.setLabel('Channel ID')
						.setStyle(TextInputStyle.Short)
				),
				new ActionRowBuilder<TextInputBuilder>().setComponents(
					new TextInputBuilder()
						.setCustomId('/schedule.time')
						.setValue(
							(interaction.createdTimestamp + 60 * 60 * 1_000).toString()
						)
						.setRequired(true)
						.setMinLength(Date.now().toString().length)
						.setMaxLength(Date.now().toString().length + 1)
						.setLabel('UNIX Timestamp (ms)')
						.setStyle(TextInputStyle.Short)
				),
				new ActionRowBuilder<TextInputBuilder>().setComponents(
					new TextInputBuilder()
						.setCustomId('/schedule.message')
						.setValue(
							'Hello, hoominz of Earth. We are the aliens from Uranus. We will be taking over your planet in 5 minutes. Please prepare for the invasion. Thank you.'
						)
						.setRequired(true)
						.setMinLength(1)
						.setMaxLength(2000)
						.setLabel('Message')
						.setStyle(TextInputStyle.Paragraph)
				)
			)
	);
};
