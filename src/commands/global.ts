import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	ModalBuilder,
	SlashCommandBuilder,
	TextInputBuilder,
	TextInputStyle,
} from 'discord.js';
import { devIds } from '../config.js';
('use strict');
export const data = new SlashCommandBuilder()
	.setName('global')
	.setDescription('Dev-only command')
	.setDMPermission(true);

// ! Do NOT add command to `coghelp.ts`

export const execute = async (interaction: ChatInputCommandInteraction) => {
	if (!devIds.includes(interaction.user.id)) {
		await interaction.reply('Restricted Commmand');
		return;
	}
	interaction.showModal(
		new ModalBuilder()
			.setTitle('DisCog Global System Announcement')
			.setCustomId('/global')
			.addComponents(
				new ActionRowBuilder<TextInputBuilder>().addComponents(
					new TextInputBuilder()
						.setCustomId('/global.text')
						.setStyle(TextInputStyle.Paragraph)
						.setLabel('Message')
						.setPlaceholder('The message to announce in all guilds')
				)
			)
	);
};
export default {
	data,
	execute,
};
