import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
	bold,
	hyperlink,
	inlineCode
} from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('about')
	.setDescription('About DisCog');

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.reply({
		components: [
			new ActionRowBuilder<ButtonBuilder>().setComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setURL('https://github.com/akpi816218/discog/commits/')
					.setLabel('Changelog'),
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setURL('https://discord.gg/invite/7A7QwXVpsJ')
					.setLabel('Discord Server')
			)
		],
		embeds: [
			new EmbedBuilder()
				.setColor(0x00ff00)
				.setThumbnail(interaction.client.user.displayAvatarURL())
				.setAuthor({
					iconURL: interaction.client.user.displayAvatarURL(),
					name: 'DisCog'
				})
				.setTimestamp()
				.setFooter({
					iconURL: interaction.client.user.displayAvatarURL(),
					text: 'About DisCog'
				})
				.setTitle('About DisCog')
				.setDescription(
					`DisCog is a versatile general purpose Discord bot. DisCog features utility commands as well as other useful commands. For a full list of commands, use the ${inlineCode(
						'/coghelp'
					)} command.\n\nThe main feature of this bot is the ${inlineCode(
						'/pronouns'
					)} command, which even supports ${bold(
						'custom pronouns'
					)}! Check it out, it's really cool.\n\nDisCog is open source and can be found on ${hyperlink(
						'GitHub',
						'https://github.com/akpi816218/discog'
					)}.\n\nAdditionally, you can join the ${hyperlink(
						'Discord development and support server',
						'https://discord.gg/invite/7A7QwXVpsJ'
					)} to get support and suggest features. If you have any questions, feel free to ask in the server.\n\nAll of the code for this bot is licensed under the ${hyperlink(
						'GNU GPLv3.0',
						'https://www.gnu.org/licenses/gpl-3.0-standalone.html'
					)}.\n\nAll features are free to use, but if you would like to support the development of this bot, you can donate ${hyperlink(
						'here',
						'https://sry-but-not-accepting-donations-rn-but-tysm-anyway.com'
					)}.`
				)
		]
	});
};
export default {
	data,
	execute
};
