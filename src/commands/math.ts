import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
	bold,
	inlineCode
} from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('math')
	.setDescription('Renders LaTeX math')
	.addStringOption((option) => {
		return option
			.setName('equation')
			.setDescription('The LaTeX equation to render')
			.setRequired(true);
	});

// ! Make sure to add command to `coghelp.ts`

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.reply('Rendering equation...');
	const equation = interaction.options.getString('equation', true);
	await interaction.editReply({
		embeds: [
			new EmbedBuilder()
				.setTitle('LaTeX Math')
				.setDescription(`${bold('LaTeX equation:')}\n${inlineCode(equation)}`)
				.setImage(
					`https://latex.codecogs.com/svg.image?%5Cinline%20%5Chuge%20${encodeURIComponent(
						equation
					)}`
				)
		]
	});
};
