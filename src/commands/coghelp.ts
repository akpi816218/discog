import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	inlineCode,
	SlashCommandBuilder,
} from 'discord.js';
import { APIEmbedField } from 'discord.js';
('use strict');

// ! New commands go here in the `fields` object
const fields: { [key: string]: APIEmbedField } = {
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
	coin: {
		name: inlineCode('/coin'),
		value: `Mine for gold, peek at people's bank accounts, and see who's on top!\n${inlineCode(
			'/coin mine'
		)}, ${inlineCode('/coin show [user: user]')}, ${inlineCode(
			'/coin leaderboard'
		)}`,
	},
	contact: {
		name: inlineCode('/contact'),
		value: `Send an email to the developers\n${inlineCode('/contact')}`,
	},
	count: {
		name: inlineCode('/count'),
		value: `Progress the count!\n${inlineCode('/count')}`,
		inline: false,
	},
	dm: {
		name: inlineCode('/dm'),
		value: `Send an official server message to a user via DMs\n${inlineCode(
			'/dm <user: user> <message: string>'
		)}`,
		inline: false,
	},
	info: {
		name: inlineCode('/guildinfo'),
		value: `Get some info\n${inlineCode('/info channel')}, ${inlineCode(
			'/info guild'
		)}`,
		inline: false,
	},
	mute: {
		name: inlineCode('/mute'),
		value: `Mutes/unmutes a user\n${inlineCode('/mute <user: user>')}`,
		inline: false,
	},
	poll: {
		name: inlineCode('/poll'),
		value: `Creates a poll\n${inlineCode(
			'/poll <question: string> <channel: channel> <option1: string> <option2: string> [option3: string] [option3: string] [option4: string] [option5: string] [option6: string] [option7: string] [option8: string] [option9: string]'
		)}`,
		inline: false,
	},
	pronouns: {
		name: inlineCode('/pronouns'),
		value: `Views or sets user pronouns\n${inlineCode(
			'/pronouns set'
		)}, ${inlineCode('/pronouns view <user: user>')}`,
		inline: false,
	},
	shove: {
		name: inlineCode('/shove'),
		value: `Shoves someone\n${inlineCode('/shove <user: user>')}`,
		inline: false,
	},
	whoasked: {
		name: inlineCode('/whoasked'),
		value: `Who? ...Asked\n${inlineCode('/whoasked <user: user>')}`,
		inline: false,
	},
	whois: {
		name: inlineCode('/whois'),
		value: `Info about a user\n${inlineCode('/whois <user: user>')}`,
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
let choices: any[] = [];
Object.keys(fields).forEach((val) => {
	choices.push({ name: val, value: val });
});

export const data = new SlashCommandBuilder()
	.setName('coghelp')
	.setDescription('Shows help')
	.addStringOption((option) => {
		return option
			.setName('command')
			.setDescription('The command to show the help for')
			.setChoices(...choices)
			.setRequired(false);
	});

export const execute = async (interaction: ChatInputCommandInteraction) => {
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
			iconURL: interaction.client.user.displayAvatarURL(),
		})
		.setColor(0x00ff00);
	let command = interaction.options.getString('command');
	if (!command) embed.addFields(Object.values(fields));
	else if (fields[command]) embed.addFields(fields[command]);
	else embed.setDescription(`The command ${command} was not found.`);
	await interaction.reply({
		embeds: [embed],
	});
};
export default {
	data,
	execute,
};
