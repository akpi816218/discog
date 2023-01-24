import { EmbedBuilder, SlashCommandBuilder, time } from 'discord.js';
('use strict');
export const data = new SlashCommandBuilder()
	.setName('whois')
	.setDescription('Who are they?')
	.setDMPermission(false)
	.addUserOption((option) => {
		return option.setName('user').setDescription('Who?').setRequired(true);
	});
export const execute = async (interaction) => {
	if (!interaction.guild) return;
	let user = interaction.options.getUser('user');
	if (!user) throw new Error();
	user = await user.fetch(true);
	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(user.hexAccentColor || null)
				.setTitle(`Who is ${user.tag}?`)
				.setThumbnail(user.displayAvatarURL())
				.addFields(
					{ name: 'ID:', value: user.id },
					{
						name: 'Discord join date:',
						value: time(user.createdAt),
					},
					{
						name: 'Server join date',
						value: time(
							(await interaction.guild.members.fetch(user)).joinedAt ||
								undefined
						),
					},
					{ name: 'Is bot?', value: user.bot.toString() }
				)
				.setTimestamp()
				.setFooter({
					text: 'Powered by DisCog',
					iconURL: interaction.client.user.displayAvatarURL(),
				}),
		],
	});
};
export default {
	data,
	execute,
};
