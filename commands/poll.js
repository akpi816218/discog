const {
	EmbedBuilder,
	inlineCode,
	SlashCommandBuilder,
	userMention,
	InteractionCollector,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription('Create a poll')
		//#region data
		.addStringOption((option) => {
			return option
				.setName('question')
				.setDescription('The question to be asked in the poll')
				.setRequired(true);
		})
		.addChannelOption((option) => {
			return option
				.setName('channel')
				.setDescription('The channel to post the poll to')
				.setRequired(true);
		})
		.addStringOption((option) => {
			return option
				.setName('option1')
				.setDescription('An answer')
				.setRequired(true);
		})
		.addStringOption((option) => {
			return option
				.setName('option2')
				.setDescription('An answer')
				.setRequired(true);
		})
		.addStringOption((option) => {
			return option
				.setName('option3')
				.setDescription('An answer')
				.setRequired(false);
		})
		.addStringOption((option) => {
			return option
				.setName('option4')
				.setDescription('An answer')
				.setRequired(false);
		})
		.addStringOption((option) => {
			return option
				.setName('option5')
				.setDescription('An answer')
				.setRequired(false);
		})
		.addStringOption((option) => {
			return option
				.setName('option6')
				.setDescription('An answer')
				.setRequired(false);
		})
		.addStringOption((option) => {
			return option
				.setName('option7')
				.setDescription('An answer')
				.setRequired(false);
		})
		.addStringOption((option) => {
			return option
				.setName('option8')
				.setDescription('An answer')
				.setRequired(false);
		})
		.addStringOption((option) => {
			return option
				.setName('option9')
				.setDescription('An answer')
				.setRequired(false);
		}),
	//#endregion data
	execute: async (interaction) => {
		//#region execute
		let options = [];
		for (let i = 1; i <= 9; i++) {
			if (i <= 2)
				options.push(interaction.options.getString(`option${i}`, true));
			else if (interaction.options.getString(`options${i}`))
				options.push(interaction.options.getString(`option${i}`, false));
		}
		let embed = new EmbedBuilder()
			.setColor(0x00ff00)
			.setTimestamp()
			.setTitle(interaction.options.getString('question'))
			.setFooter({ text: 'Poll powered by DisCog' });
		options.forEach((value) => {
			embed.addField
		});
		let msgobj = {
			content: ``,
			embeds: [embed],
		};
		let msg = await interaction.options
			.getChannel('channel', true)
			.send(msgobj);
		options.forEach(async (value, index) => {
			switch (index) {
				case 0:
					await msg.react(':one:');
					break;
				case 1:
					await msg.react(':two:');
					break;
				case 2:
					await msg.react(':three:');
					break;
				case 3:
					await msg.react(':four:');
					break;
				case 4:
					await msg.react(':five:');
					break;
				case 5:
					await msg.react(':six:');
					break;
				case 6:
					await msg.react(':seven:');
					break;
				case 7:
					await msg.react(':eight:');
					break;
				case 8:
					await msg.react(':nine:');
					break;
			}
		});
		//#endregion execute
	},
};
