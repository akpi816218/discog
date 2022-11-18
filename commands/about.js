import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from 'discord.js';
('use strict');
export const data = new SlashCommandBuilder()
	.setName('about')
	.setDescription('About DisCog');
/**
 *
 * @param {ChatInputCommandInteraction} interaction
 */
export const execute = async (interaction) => {
	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(0x00ff00)
				.setThumbnail(client.user.displayAvatarURL())
				.setAuthor({
					name: 'DisCog',
					iconURL: client.user.displayAvatarURL(),
				})
				.setTimestamp()
				.setFooter({
					text: 'About DisCog',
					iconURL: client.user.displayAvatarURL(),
				})
				.setTitle('About DisCog')
				.setDescription(
					`DisCog is a versatile general purpose Discord bot. DisCog features utility commands as well as some games and fun commands.`
				),
		],
	});
};
export default {
	data,
	execute,
};
