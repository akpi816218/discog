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
			'/announce <channel: channel> <message: string> [mentionEveryone: boolean || false]'
		)}`
	},
	coghelp: {
		name: inlineCode('/coghelp'),
		value: `Shows general help or help for a specific command\n${inlineCode(
			'/coghelp [command: string]'
		)}`
	},
	contact: {
		name: inlineCode('/contact'),
		value: `Sends a report to the developers\n${inlineCode('/contact')}`
	},
	dev: {
		name: inlineCode('/dev'),
		value: `Developer-only command\n${inlineCode(
			'/dev'
		)}\nYou need to be a developer to use this command. If you don't believe me, try it. You'll see.`
	},
	dm: {
		name: inlineCode('/dm'),
		value: `Sends an official server message to a user via DMs\n${inlineCode(
			'/dm <user: user> <message: string>'
		)}\nUnless a server admin configured this command differently, this should not be available to most users.`
	},
	donate: {
		name: inlineCode('/donate'),
		value: `Support bot development! Please? Thank you!\n${inlineCode(
			'/donate'
		)}\nPLEASE DONATE!`
	},
	identity: {
		name: inlineCode('/identity'),
		value: `Create an identity profile or view one\n${inlineCode(
			'/identity view [user: user || @self]'
		)}${inlineCode(
			'/identity pronouns set [custom: boolean || false]'
		)}, ${inlineCode(
			'/identity pronouns view [user: user || @self]'
		)}, ${inlineCode('/identity name set <name: string>')}, ${inlineCode(
			'/identity name view [user: user || @self]'
		)}, ${inlineCode('/identity bio set')}, ${inlineCode(
			'/identity bio view [user: user || @self]'
		)}, ${inlineCode('/identity gender set')}, ${inlineCode(
			'/identity gender view [user: user || @self]'
		)}`
	},
	info: {
		name: inlineCode('/info'),
		value: `Gets some info\n${inlineCode('/info channel')}, ${inlineCode(
			'/info guild'
		)}`
	},
	ping: {
		name: inlineCode('/ping'),
		value: `Checks the bot's ping\n${inlineCode('/ping')}`
	},
	poll: {
		name: inlineCode('/poll'),
		value: `Creates a poll\n${inlineCode(
			'/poll <question: string> <channel: channel> [pingeveryone: boolean || false] <option1: string> <option2: string> [option3: string] [option3: string] [option4: string] [option5: string] [option6: string] [option7: string] [option8: string] [option9: string]'
		)}`
	},
	tetrio: {
		name: inlineCode('/tetrio'),
		value: `Get a user's stats on TETR.IO\n${inlineCode(
			'/tetrio view <username: string>'
		)}, ${inlineCode('/tetrio discord <user: user>')}`
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
			.setDescription('The command to show help for')
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
			)} represents a required argument.\n${inlineCode(
				'@self'
			)} represents the user who ran the command.\n${inlineCode(
				'type || default'
			)} means an option of type ${inlineCode(
				'type'
			)} with a default value of ${inlineCode('default')}.`
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
	else
		embed.setDescription(`The command ${inlineCode(command)} was not found.`);
	await interaction.reply({
		embeds: [embed]
	});
};
