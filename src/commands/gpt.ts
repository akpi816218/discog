import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder
} from 'discord.js';
import { CHATGPT_API_KEY } from '../TOKEN';
import { ChatGPTAPI } from 'chatgpt';

export const data = new SlashCommandBuilder()
	.setName('gpt')
	.setDescription('Talk to ChatGPT for free!')
	.addStringOption((option) => {
		return option
			.setName('prompt')
			.setDescription('The prompt to send to ChatGPT')
			.setRequired(true);
	});

// ! Make sure to add command to `coghelp.ts`

export const execute = async (interaction: ChatInputCommandInteraction) => {
	interaction.reply('Working...');
	const prompt = interaction.options.getString('prompt');
	if (!prompt || prompt == '') {
		await interaction.editReply('Error: invalid prompt');
		return;
	}
	const api = new ChatGPTAPI({ apiKey: CHATGPT_API_KEY });
	const response = await api.sendMessage(prompt);
	await interaction.editReply({
		embeds: [
			new EmbedBuilder()
				.setTitle('/gpt')
				.setDescription(response.text)
				.setFooter({
					iconURL: interaction.client.user.displayAvatarURL(),
					text: 'Powered by DisCog'
				})
				.setTimestamp()
		]
	});
};
export default {
	data,
	execute
};
