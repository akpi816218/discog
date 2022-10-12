const { EmbedBuilder, inlineCode, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coghelp')
		.setDescription('Shows help')
		.addStringOption((option) => {
			return option
				.setName('command')
				.setDescription('The command to show the help for')
				.setRequired(false);
		}),
	execute: async (interaction) => {
		let embed = new EmbedBuilder()
			.setTitle('DisCog Help')
			.setDescription(
				`${inlineCode(
					'[argument: type]'
				)} represents an optional argument. ${inlineCode(
					'<argument: type>'
				)} represents a required argument.`
			)
			.setTimestamp()
			.setFooter({
				text: `Requested by ${interaction.user.tag}`,
				iconURL:
					'https://raw.githubusercontent.com/akpi816218/discog/gitmaster/discog.png',
			})
			.setColor(0x00ff00);
		// ! New commands go here in the `fields` object
		const fields = {
			about: {
				name: inlineCode('/about'),
				value: `About this bot\n${inlineCode('/about')}`,
				inline: false,
			},
			announce: {
				name: inlineCode('/announce'),
				value: `Creates and announcement in the specified channel\n${inlineCode(
					'/announce <channel: channel> <message: string> [mentionEveryone: boolean, default=false]'
				)}`,
				inline: false,
			},
			cheesetouch: {
				name: inlineCode('/cheesetouch'),
				value: `Transfers the cheese touch to someone else\n${inlineCode(
					'/cheesetouch <user: user> [force: boolean, default=false]'
				)}\nNote that the ${inlineCode(
					'force'
				)} option won't work when set to ${inlineCode(
					'true'
				)} unless you own the bot.`,
			},
			coghelp: {
				name: inlineCode('/coghelp'),
				value: `Shows general help or help for a specific command\n${inlineCode(
					'/coghelp [command: string]'
				)}`,
				inline: false,
			},
			count: {
				name: inlineCode('/count'),
				value: `Progress the count!\n${inlineCode('/count')}`,
				inline: false,
			},
			poll: {
				name: inlineCode('/poll'),
				value: `Creates a poll\n${inlineCode(
					'/poll <question: string> <channel: channel> <option1: string> <option2: string> [option3: string] [option3: string] [option4: string] [option5: string] [option6: string] [option7: string] [option8: string] [option9: string]'
				)}`,
				inline: false,
			},
			ynpoll: {
				name: inlineCode('/ynpoll'),
				value: `Creates a yes/no poll\n${inlineCode(
					'/ynpoll <question: string> <channel: channel>'
				)}`,
				inline: false,
			},
		};
		if (!interaction.options.getString('command')) {
			//#region general
			embed
				.addFields(Object.values(fields));
			//#endregion general
		} else {
			switch (interaction.options.getString('command')) {
				case 'about':
					embed.addFields(fields.about);
					break;
				case 'announce':
					embed.addFields(fields.announce);
					break;
				case 'cheesetouch':
					embed.addFields(fields.cheesetouch);
					break;
				case 'coghelp':
					embed.addFields(fields.coghelp);
					break;
				case 'count':
					embed.addFields(fields.count);
					break;
				case 'poll':
					embed.addFields(fields.poll);
					break;
				case 'ynpoll':
					embed.addFields(fields.ynpoll);
					break;
				default:
					await interaction.reply(
						`${interaction.options.getString('command')} is not a valid command`
					);
					return;
			}
		}
		await interaction.reply({
			embeds: [embed],
		});
	},
};
``;
