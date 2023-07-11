import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
	bold,
	hyperlink,
	inlineCode,
	italic
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
					.setURL('https://discog.localplayer.dev')
					.setLabel('Website'),
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setURL('https://github.com/akpi816218/discog/commits/')
					.setLabel('Changelog'),
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setURL('https://discog.localplayer.dev/invite/support-server')
					.setLabel('Support/Development Server')
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
					`${hyperlink(
						'DisCog',
						'https://discog.localplayer.dev'
					)} is a versatile general purpose Discord bot featuring utility commands as well a random collection of other commands. For a full list of commands, use the ${inlineCode(
						'/coghelp'
					)} command.\n\nThe main feature of this bot is the ${inlineCode(
						'/identity'
					)} command, which even supports ${bold(
						`custom pronouns, genders, and more. You can even set your preferred name and a bio (if you can't fit it in your Discord profile)! While Discord allows you 190 characters to describe yourself, DisCog allows you ${italic(
							'500'
						)}`
					)}! Check it out, it's really cool.\n\nDisCog can also send you birthday wishes if you use the ${inlineCode(
						'/bday register'
					)} command to register your birthdate\n\nDisCog is open source and can be found on ${hyperlink(
						'GitHub',
						'https://github.com/akpi816218/discog'
					)}.\n\nAdditionally, you can join the ${hyperlink(
						'Discord development and support server',
						'https://discog.localplayer.dev/invite/support-server'
					)} to get support and suggest features. If you have any questions, feel free to ask in the server.\n\nAll of the code for this bot is licensed under the ${hyperlink(
						'MIT License',
						'https://github.com/akpi816218/discog/blob/gitmaster/LICENSE'
					)}.\n\nAll features are free to use, but if you would like to support the development of this bot, you can donate ${hyperlink(
						'here',
						'https://discog.localplayer.dev/donate'
					)}.`
				)
		]
	});
};
