import { SlashCommandBuilder, userMention, EmbedBuilder } from 'discord.js';
('use strict');
export const data = new SlashCommandBuilder()
	.setName('ynpoll')
	.setDescription('Create a yes/no poll')
	.setDMPermission()
	.addStringOption((option) => {
		return option
			.setName('question')
			.setDescription('The question to ask in the poll')
			.setRequired(true);
	})
	.addChannelOption((option) => {
		return option
			.setName('channel')
			.setDescription('The channel to send the poll to')
			.setRequired(true);
	});
export const execute = async (interaction, client) => {
	let msgObj = {
		content: '',
		embeds: [
			new EmbedBuilder()
				.setColor(0x00ff00)
				.setTimestamp()
				.setTitle(interaction.options.getString('question'))
				.setFooter({
					text: 'Poll powered by DisCog',
					iconURL: client.user.displayAvatarURL(),
				}),
		],
	};
	if (interaction.options.getBoolean())
		msgObj.content = `@everyone new poll by ${userMention(
			interaction.user.id
		)}`;
	else msgObj.content = `New poll by ${userMention(interaction.user.id)}`;
	let msg = await interaction.options.getChannel('channel').send(msgObj);
	await msg.react('👍');
	await msg.react('👎');
	await msg.react('🧐'); // face_with_monocle
	await interaction.reply('Done.');
};
export default {
	data,
	execute,
};
