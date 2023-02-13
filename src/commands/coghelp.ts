import {
	APIEmbedField,
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
	inlineCode
} from 'discord.js';

// ! New commands go here in the `fields` object
const fields: { [key: string]: APIEmbedField } = {
	about: {
		name: inlineCode('/about'),
		value: `About this bot\n${inlineCode('/about')}`
	},
	announce: {
		name: inlineCode('/announce'),
		value: `Creates and announcement in the specified channel\n${inlineCode(
			'/announce <channel: channel> <message: string> [mentionEveryone: boolean, default=false]'
		)}`
	},
	coghelp: {
		name: inlineCode('/coghelp'),
		value: `Shows general help or help for a specific command\n${inlineCode(
			'/coghelp [command: string]'
		)}`
	},
	coin: {
		name: inlineCode('/coin'),
		value: `Mine for gold, peek at people's bank accounts, and see who's on top!\n${inlineCode(
			'/coin mine'
		)}, ${inlineCode('/coin show [user: user]')}, ${inlineCode(
			'/coin leaderboard'
		)}`
	},
	contact: {
		name: inlineCode('/contact'),
		value: `Send a report to the developers\n${inlineCode('/contact')}`
	},
	dm: {
		name: inlineCode('/dm'),
		value: `Send an official server message to a user via DMs\n${inlineCode(
			'/dm <user: user> <message: string>'
		)}`
	},
	guildinfo: {
		name: inlineCode('/guildinfo'),
		value: `Get some info\n${inlineCode('/info channel')}, ${inlineCode(
			'/info guild'
		)}`
	},
	mute: {
		name: inlineCode('/mute'),
		value: `Mutes/unmutes a user\n${inlineCode('/mute <user: user>')}`
	},
	ping: {
		name: inlineCode('/ping'),
		value: `Checks the bot's ping\n${inlineCode('/ping')}`
	},
	poll: {
		name: inlineCode('/poll'),
		value: `Creates a poll\n${inlineCode(
			'/poll <question: string> <channel: channel> <option1: string> <option2: string> [option3: string] [option3: string] [option4: string] [option5: string] [option6: string] [option7: string] [option8: string] [option9: string]'
		)}`
	},
	pronouns: {
		name: inlineCode('/pronouns'),
		value: `Views or sets user pronouns\n${inlineCode(
			'/pronouns set [custom:boolean]'
		)}, ${inlineCode('/pronouns view [user: user]')}`
	}
};

interface CommandHelpEntry {
	name: string;
	value: string;
}

const choices: CommandHelpEntry[] = [];
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
	const embed = new EmbedBuilder()
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
			iconURL: interaction.client.user.displayAvatarURL(),
			text: `Requested by ${interaction.user.tag}`
		})
		.setColor(0x00ff00);
	const command = interaction.options.getString('command');
	if (!command) embed.addFields(Object.values(fields));
	else if (fields[command]) embed.addFields(fields[command]);
	else embed.setDescription(`The command ${command} was not found.`);
	await interaction.reply({
		embeds: [embed]
	});
};
export default {
	data,
	execute
};
