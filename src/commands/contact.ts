import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	ModalBuilder,
	SlashCommandBuilder,
	TextInputBuilder,
	TextInputStyle,
	inlineCode
} from 'discord.js';
import { CommandHelpEntry } from '../struct/CommandHelpEntry';

export const data = new SlashCommandBuilder()
	.setName('contact')
	.setDescription('Send a report to the developers')
	.addSubcommand(subcommand => {
		subcommand
			.setName('suggestion')
			.setDescription('Send a suggestion to the developers');
		return subcommand;
	});

export const help = new CommandHelpEntry('contact', 'Contact the developers');

export const execute = async (interaction: ChatInputCommandInteraction) => {
	if (interaction.options.getSubcommand() === 'suggestion')
		await interaction.showModal(
			new ModalBuilder()
				.setTitle('Suggestion')
				.setCustomId('/contact_suggestion')
				.setComponents(
					new ActionRowBuilder<TextInputBuilder>().setComponents(
						new TextInputBuilder()
							.setLabel('Message')
							.setStyle(TextInputStyle.Paragraph)
							.setPlaceholder('Enter your suggestion here')
							.setCustomId('suggestion')
							.setMinLength(1)
							.setMaxLength(2000)
					)
				)
		);
	await interaction.reply({
		components: [
			new ActionRowBuilder<ButtonBuilder>().setComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setURL('https://discog.localplayer.dev/invite/support-server')
					.setLabel('Support Server')
			)
		],
		content: `Send a DM to ${inlineCode('@equus_quagga')}!`,
		ephemeral: true
	});
};
