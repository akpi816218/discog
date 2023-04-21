import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	inlineCode
} from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('contact')
	.setDescription('Send a report to the developers');

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.reply({
		components: [
			new ActionRowBuilder<ButtonBuilder>().setComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setURL('https://discord.gg/7A7QwXVpsJ')
					.setLabel('Discord Server')
			)
		],
		content: `Send a DM to ${inlineCode('@equus quagga#4492')}!`,
		ephemeral: true
	});
};
