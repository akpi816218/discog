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
						'/identity'
					)} command, which even supports ${bold(
						"custom pronouns, genders, and more. You can even set your preferred name and a bio (if you can't fit it in your Discord profile)!"
					)}! Check it out, it's really cool.\n\nAnother recently added feature is the ${inlineCode(
						'/tetrio'
					)} command, which can be used to check a user's stats on ${hyperlink(
						'TETR.IO',
						'https://tetr.io/about/'
					)}. Find users via username using ${inlineCode(
						'/tetrio view'
					)}, or use${inlineCode(
						'/tetrio discord'
					)} to lookup a user using their Discord mention if they have integrated their account with TETR.IO.\n\nDisCog is open source and can be found on ${hyperlink(
						'GitHub',
						'https://github.com/akpi816218/discog'
					)}.\n\nAdditionally, you can join the ${hyperlink(
						'Discord development and support server',
						'https://discord.gg/invite/7A7QwXVpsJ'
					)} to get support and suggest features. If you have any questions, feel free to ask in the server.\n\nAll of the code for this bot is licensed under the ${hyperlink(
						'GNU GPL v3.0',
						'https://www.gnu.org/licenses/gpl-3.0-standalone.html'
					)}.\n\nAll features are free to use, but if you would like to support the development of this bot, you can donate ${hyperlink(
						'here',
						'https://sry-but-not-accepting-donations-rn-but-tysm-anyway.com'
					)}.`
				)
		]
	});
};
