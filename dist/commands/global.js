import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
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
export const execute = async (interaction) => {
	await interaction.deferReply({ ephemeral: true });
	const messageid = interaction.options.getString('messageid');
	if (!interaction.channel) throw new Error();
	if (!devIds.includes(interaction.user.id) || !messageid) {
		await interaction.followUp('Restricted Commmand');
		return;
	}
	let message = await interaction.channel.messages.fetch(messageid.toString());
	if (typeof message == 'undefined') {
		await interaction.followUp({
			content: 'Invalid message ID',
			ephemeral: true,
		});
		return;
	}
	interaction.client.guilds.cache.forEach((guild) => {
		guild.systemChannel?.send({
			content: '@everyone',
			embeds: [
				new EmbedBuilder()
					.setTitle('DisCog System Announcement')
					.setDescription(message.content)
					.setTimestamp()
					.setFooter({
						text: `Sent by ${interaction.user.tag}`,
						iconURL: interaction.user.displayAvatarURL(),
					}),
			],
		});
	});
	interaction.followUp({ content: 'Done.', ephemeral: true });
};
export default {
	data,
	execute,
};
