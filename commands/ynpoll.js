const {
	SlashCommandBuilder,
	userMention,
	EmbedBuilder,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('name')
		.setDescription('description')
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
		}),
	execute: async (interaction) => {
		let msgObj = {
			content: '',
			embeds: [
				new EmbedBuilder()
					.setColor(0x0f0)
					.setTimestamp()
					.setTitle(interaction.options.getString('question'))
					.setFooter({
						text: 'Poll powered by DisCog',
						iconURL:
							'https://raw.githubusercontent.com/akpi816218/discog/gitmaster/discog.png',
					}),
			],
		};
		if (interaction.options.getBoolean())
			msgObj.content = `@everyone new poll by ${userMention(
				interaction.user.id
			)}`;
		else msgObj.content = `New poll by ${userMention(interaction.user.id)}`;
		let msg = await interaction.options.getChannel('channel').send(msgObj);
		await msg.react(':thumbsup:');
		await msg.react(':thumbsdown:');
		await msg.react(':face_with_monocle:');
		await interaction.reply('Done.');
	},
};
