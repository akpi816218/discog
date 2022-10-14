const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('About DisCog'),
	execute: async (interaction, client) => {
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(0x00ff00)
					.setThumbnail(
						'https://raw.githubusercontent.com/akpi816218/discog/gitmaster/discog.png'
					)
					.setAuthor({
						name: 'DisCog',
						iconURL:
							'https://raw.githubusercontent.com/akpi816218/discog/gitmaster/discog.png',
					})
					.setTimestamp()
					.setFooter({
						text: 'About DisCog',
						iconURL:
							'https://raw.githubusercontent.com/akpi816218/discog/gitmaster/discog.png',
					})
					.setTitle('About DisCog')
					.setDescription(
						`DisCog is a versatile general purpose Discord bot. DisCog features utility commands as well as some games.`
					),
			],
		});
	},
};
