import {
	EmbedBuilder,
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	ColorResolvable,
} from 'discord.js';
('use strict');
export const data = new SlashCommandBuilder()
	.setName('whois')
	.setDescription('Who are they?')
	.setDMPermission(false)
	.addUserOption((option) => {
		return option.setName('user').setDescription('Who?').setRequired(true);
	});

export const execute = async (interaction: ChatInputCommandInteraction) => {
	let user = interaction.options.getUser('user');
	if (!user) throw new Error();
	user = await user.fetch(true);
	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(user.hexAccentColor as ColorResolvable)
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
					iconURL: interaction.client.user.displayAvatarURL(),
				}),
		],
	});
};
export default {
	data,
	execute,
};
