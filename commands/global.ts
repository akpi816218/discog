import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	Message,
	SlashCommandBuilder,
} from 'discord.js';
import { devIds } from '../config.js';
('use strict');
export const data = new SlashCommandBuilder()
	.setName('global')
	.setDescription('Dev-only command')
	.addStringOption((option) => {
		return option
			.setName('messageid')
			.setDescription('The ID of the message')
			.setRequired(true);
	})
	.setDMPermission(true);

// ! Do NOT add command to `coghelp.ts`

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.deferReply();
	const messageid = interaction.options.getString('messageid');
	if (!devIds.includes(interaction.user.id) || !messageid) return;
	let message = await interaction.channel?.messages.fetch(messageid.toString());
	if (typeof message == 'undefined') {
		await interaction.reply({ content: 'Invalid message ID', ephemeral: true });
		return;
	}
	interaction.client.guilds.cache.forEach((guild) => {
		guild.systemChannel?.send({
			content: '@everyone',
			embeds: [
				new EmbedBuilder()
					.setTitle('DisCog System Announcement')
					.setDescription((message as Message).content)
					.setTimestamp()
					.setFooter({
						text: `Sent by ${interaction.user.tag}`,
						iconURL: interaction.user.displayAvatarURL(),
					}),
			],
		});
	});
};
export default {
	data,
	execute,
};
