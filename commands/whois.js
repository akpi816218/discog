import {
	EmbedBuilder,
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	Client,
} from 'discord.js';
('use strict');
export const data = new SlashCommandBuilder()
	.setName('whois')
	.setDescription('Who are they?')
	.setDMPermission(false)
	.addUserOption((option) => {
		return option.setName('user').setDescription('Who?').setRequired(true);
	});
/**
 * @param {ChatInputCommandInteraction} interaction
 * @param {Client} client
 */
export const execute = async (interaction, client) => {
	const user = await interaction.options.getUser('user').fetch(true);
	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(user.hexAccentColor)
				.setTitle(`Who is ${user.tag}?`)
				.setThumbnail(user.displayAvatarURL())
				.addFields(
					{ name: 'ID:', value: user.id.toString() },
					{ name: 'Join date:', value: user.createdAt.toLocaleString() },
					{ name: 'Is bot?', value: user.bot.toString() }
				)
				.setTimestamp()
				.setFooter({
					text: 'Powered by DisCog',
					iconURL: client.user.displayAvatarURL(),
				}),
		],
	});
};
export default {
	data,
	execute,
};
