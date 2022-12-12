import { SlashCommandBuilder, userMention, EmbedBuilder } from 'discord.js';
('use strict');
export const data = new SlashCommandBuilder()
	.setName('ynpoll')
	.setDescription('Create a yes/no poll')
	.setDMPermission(false)
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
	})
	.addBooleanOption((option) => {
		return option
			.setName('pingall')
			.setDescription('Ping everyone?')
			.setRequired(false);
	});
export const execute = async (interaction) => {
	let msgObj = {
		content: '',
		embeds: [
			new EmbedBuilder()
				.setColor(0x00ff00)
				.setTimestamp()
				.setTitle(interaction.options.getString('question'))
				.setFooter({
					text: 'Poll powered by DisCog',
					iconURL: interaction.client.user.displayAvatarURL(),
				}),
		],
	};
	if (interaction.options.getBoolean('pingall'))
		msgObj.content = `@everyone new poll by ${userMention(
			interaction.user.id
		)}`;
	else msgObj.content = `New poll by ${userMention(interaction.user.id)}`;
	let channel = interaction.options.getChannel('channel');
	if (!channel) throw new Error();
	let msg = await channel.send(msgObj);
	await msg.react('👍');
	await msg.react('👎');
	await msg.react('🧐'); // face_with_monocle
	await interaction.reply('Done.');
};
export default {
	data,
	execute,
};
