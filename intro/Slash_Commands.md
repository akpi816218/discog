# Slash Commands

## Initial file setup

When creating a new slash command, start with a copy of the template: `cp commands/z.command.tstemplate commands/${CMND_NAME}.ts`

```typescript
import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from 'discord.js';
('use strict');
export const data = new SlashCommandBuilder()
	.setName('name')
	.setDescription('description');

// ! Make sure to add command to `coghelp.ts`

export const execute = async (interaction: ChatInputCommandInteraction) => {
	/* "Powered by DisCog" template
	 *	await interaction.reply({
	 *		embeds: [
	 *			new EmbedBuilder().setFooter({
	 *				text: 'Powered by DisCog',
	 *				iconURL: interaction.client.user.displayAvatarURL(),
	 *			}),
	 *		],
	 *	});
	 */
};
export default {
	data,
	execute,
};
```

## Coding the command

Set the command name and description, options, and member and channel permissions using the `SlashCommandBuilder` object. Add the help for the command to `coghelp.ts` and remove the comment. The code for the command should go inside the `execute` function. The `ChatInputCommandInteraction` must be the sole parameter to the function.

## Command rules

- All command names (including filenames) should be lowercase.
- For data storage, use the `Jsoning` package. Add `import Jsoning from 'jsoning';` after the Discord.js imports.
