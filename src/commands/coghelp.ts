import {
	APIEmbedField,
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
	inlineCode,
	strikethrough
} from 'discord.js';
import { CommandHelpEntry } from '../struct/CommandHelpEntry';

// ! New commands go here in the `fields` object
const entries: { [key: string]: CommandHelpEntry } = {
	about: new CommandHelpEntry('about', 'Shows info about the bot'),
	admin: new CommandHelpEntry('admin', 'Run `/admin` for help'),
	anime: new CommandHelpEntry(
		'anime',
		'Get an anime image or GIF from nekos.best',
		[
			'image <category: string> [count: 1 <= number <= 5 || 1]',
			'gif <category: string> [count: 1 <= number <= 5 || 1]'
		]
	),
	announce: new CommandHelpEntry(
		'announce',
		'Creates an announcement in the specified channel',
		'<channel: channel> <message: string> [mentionEveryone: boolean || false]'
	),
	bday: new CommandHelpEntry(
		'bday',
		"Register your birthday or view another's",
		[
			'register <month: number> <day: number> <year: number>',
			'view [user: user || @self]'
		]
	),
	coghelp: new CommandHelpEntry(
		'coghelp',
		'Shows general help or help for a specific command',
		'[command: string]'
	),
	contact: new CommandHelpEntry('contact', 'Contact the developers'),
	dm: new CommandHelpEntry(
		'dm',
		'Sends an official server message to a user via DMs',
		'<user: user> <message: string>'
	),
	donate: new CommandHelpEntry(
		'donate',
		'Support bot development! Please? Thank you!'
	),
	github: new CommandHelpEntry(
		'github',
		'View some info for GitHub users',
		'profile <username: string>',
		'repos <username: string>',
		'stats <username: string>'
	),
	info: new CommandHelpEntry('info', 'Gets some info', ['channel', 'guild']),
	poll: new CommandHelpEntry('poll', 'Creates a poll', [
		'<question: string> <channel: channel> [pingeveryone: boolean || false] <option1: string> <option2: string> [option3: string] [option3: string] [option4: string] [option5: string] [option6: string] [option7: string] [option8: string] [option9: string]'
	]),
	qr: new CommandHelpEntry(
		'qr',
		'Encodes some text or a link in a QR code',
		'<text: string>'
	),
	tetrio: new CommandHelpEntry(
		'tetrio',
		"Get a user's stats on TETR.IO, either from their username or Discord account (if connected)",
		['view <username: string>', 'discord <user: user>']
	),
	unix: new CommandHelpEntry('unix', 'Converts UNIX timestamps', [
		'date <timestamp: number>',
		'timestamp <date: string>'
	])
};

const fields: APIEmbedField[] = [];
for (const entry of Object.values(entries))
	fields.push(entry.toDiscordAPIEmbedField());

export const data = new SlashCommandBuilder()
	.setName('coghelp')
	.setDescription('Shows help')
	.addStringOption(option => {
		return option
			.setName('command')
			.setDescription('The command to show help for')
			.setChoices(
				...Object.keys(entries).map(key => {
					return { name: key, value: key };
				})
			)
			.setRequired(false);
	});

export const execute = async (interaction: ChatInputCommandInteraction) => {
	const embed = new EmbedBuilder()
		.setTitle('DisCog Help')
		.setDescription(
			`\`[argument: type]\` represents an optional argument. \`<argument: type>\` represents a required argument.\n\`@self\` represents the user who ran the command.\n\`type || default\` means an option of type \`type\`with a default value of \`default\`.\n\`[argument: a < number < b]\` represents an optional argument of type \`number\` between \`a\` and \`b\` (exclusive). `
		)
		.setTimestamp()
		.setFooter({
			iconURL: interaction.client.user.displayAvatarURL(),
			text: `Requested by ${interaction.user.username}`
		})
		.setColor(0x00ff00);
	const command = interaction.options.getString('command');
	if (!command) embed.addFields(Object.values(fields));
	else if (entries[command])
		embed.addFields(entries[command].toDiscordAPIEmbedField());
	else
		embed.setDescription(`The command ${inlineCode(command)} was not found.`);
	await interaction.reply({
		embeds: [embed]
	});
};
