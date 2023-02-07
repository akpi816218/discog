import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	inlineCode
} from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('contact')
	.setDescription('Send an email to the developers');

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.reply(`Send a DM to ${inlineCode('@equus quagga#4492')}!`);
};
export default {
	data,
	execute
};
