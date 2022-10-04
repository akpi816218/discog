const { SlashCommandBuilder, userMention } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('announce')
		.setDescription('Creates an announcement in the specified channel')
		.setDMPermission(false)
		.addChannelOption((option) => {
			return option
				.setName('channel')
				.setDescription('The channel to send the announcement to')
				.setRequired(true);
		})
		.addStringOption((option) => {
			return option
				.setName('message')
				.setDescription('The message to be announced')
				.setRequired(true);
		})
		.addBooleanOption((option) => {
			return option
				.setName('mention')
				.setDescription('Whether @everyone should be mentioned');
		}),
	async execute(interaction) {
		let msgContent = 'Pay attention.';
		if (interaction.options.getBoolean('mention')) {
			msgContent = '@everyone pay attention.';
		}
		await interaction.options.getChannel('channel').send({
			content: msgContent,
			embeds: [
				{
					color: 0xffff00,
					title: `Announcement by @${interaction.user.tag}:`,
					description: interaction.options.getString('message'),
				},
			],
		});
		await interaction.reply({
			content: 'Done.',
			ephemeral: true,
		});
	},
};
