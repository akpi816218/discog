const { EmbedBuilder, inlineCode, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coghelp')
		.setDescription('Shows help'),
	/*.addStringOption((option) => {
			return option
				.setName('command')
				.setDescription('The command to show the help for')
				.setRequired(false);
		}),*/ execute: async (interaction) => {
		let embed = new EmbedBuilder()
			.setTitle('DisCog Help')
			.setDescription(
				`${inlineCode(
					'[argument: type]'
				)} represents an optional argument. ${inlineCode(
					'<argument: type>'
				)} represents a required argument.`
			)
			.setColor(0x00ff00)
			.addFields(
				{
					name: inlineCode('/announce'),
					value: `Creates and announcement in the specified channel\n${inlineCode(
						'/announce <channel: channel> <message: string> [mentionEveryone: boolean, default: false]'
					)}`,
					inline: false,
				},
				{
					name: inlineCode('/cheesetouch'),
					value: `Transfers the cheese touch to someone else\n${inlineCode(
						'/cheesetouch <user: user>'
					)}`,
				},
				{
					name: inlineCode('/coghelp'),
					value: `Shows this help message\n${inlineCode(
						'/coghelp [command: string]'
					)}`,
					inline: false,
				},
				{
					name: inlineCode('/count'),
					value: `Progress the count!\n${inlineCode('/count')}`,
					inline: false,
				},
				{
					name: inlineCode('/poll'),
					value: `Creates a poll\n${inlineCode(
						'/poll <question: string> <channel: channel> <option1: string> <option2: string> [option3: string] [option3: string] [option4: string] [option5: string] [option6: string] [option7: string] [option8: string] [option9: string]'
					)}`,
					inline: false,
				}
			);
		await interaction.reply({
			embeds: [embed],
		});
	},
};
``;
