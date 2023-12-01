import {
	APIEmbedField,
	ChatInputCommandInteraction,
	Collection,
	EmbedBuilder,
	SlashCommandBuilder,
	inlineCode
} from 'discord.js';
import { readdir } from 'fs/promises';
import { CommandHelpEntry } from '../struct/CommandHelpEntry';
import { commandsPath } from '../../scripts/registerCommands';

const files = (await readdir(commandsPath)).filter(file =>
		file.endsWith('.ts')
	),
	fields = new Collection<string, APIEmbedField>();
for (const file of files) {
	const { help } = (await import(`${commandsPath}/${file}`)) as {
		help?: CommandHelpEntry;
	};
	if (help) fields.set(help.name, help.toDiscordAPIEmbedField());
}

export const data = new SlashCommandBuilder()
	.setName('coghelp')
	.setDescription('Shows help')
	.addStringOption(option => {
		return option
			.setName('command')
			.setDescription('The command to show help for')
			.setChoices(
				...Object.keys(fields).map(key => {
					return { name: key, value: key };
				})
			)
			.setRequired(false);
	});

export const help = new CommandHelpEntry(
	'coghelp',
	'Shows general help or help for a specific command',
	'[command: string]'
);

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
	if (!command) embed.addFields(...fields.values());
	else if (fields.has(command)) embed.addFields(fields.get(command)!);
	else
		embed.setDescription(
			`Command ${inlineCode(command)} not found. Use ${inlineCode(
				'/coghelp'
			)} to see all commands.`
		);
	await interaction.reply({
		embeds: [embed]
	});
};
