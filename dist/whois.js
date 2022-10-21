import { EmbedBuilder, SlashCommandBuilder, userMention } from 'discord.js';
('use strict');
export const data = new SlashCommandBuilder()
	.setName('whois')
	.setDescription('Who are they?')
	.setDMPermission(false)
	.addUserOption((option) => {
		return option.setName('user').setDescription('Who?').setRequired(true);
	});
export const execute = async (interaction, client) => {
	let user = await interaction.options.getUser('user').fetch(true);
	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(user.hexAccentColor)
				.setTitle(`Who is ${userMention(user.id)}?`)
				.setThumbnail(user.displayAvatarUrl())
				.addFields(
					{ name: 'Tag:', value: user.tag },
					{ name: 'Join date:', value: user.createdAt().toLocaleString() },
					{ name: 'Banner Link:', value: user.bannerURL() },
					{ name: 'Is bot?', value: user.bot }
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
