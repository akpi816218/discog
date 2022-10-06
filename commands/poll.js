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
		// create array of options
		for (let i = 1; i <= 9; i++) {
			if (i <= 2)
				options.push(interaction.options.getString(`option${i}`, true));
			else if (interaction.options.getString(`options${i}`))
				options.push(interaction.options.getString(`option${i}`, false));
		}
		// create embed
		let embed = new EmbedBuilder()
			.setColor(0x00ff00)
			.setTimestamp()
			.setTitle(interaction.options.getString('question'))
			.setFooter({
				text: 'Poll powered by DisCog',
				iconURL:
					'https://raw.githubusercontent.com/akpi816218/discog/gitmaster/discog.png',
			});
		// populate embed with options
		options.forEach((value, index) => {
			switch (index) {
				case 0:
					embed.addFields({ name: ':one:', value: value, inline: false });
					break;
				case 1:
					embed.addFields({ name: ':two:', value: value, inline: false });
					break;
				case 2:
					embed.addFields({ name: ':three:', value: value, inline: false });
					break;
				case 3:
					embed.addFields({ name: ':four:', value: value, inline: false });
					break;
				case 4:
					embed.addFields({ name: ':five:', value: value, inline: false });
					break;
				case 5:
					embed.addFields({ name: ':six:', value: value, inline: false });
					break;
				case 6:
					embed.addFields({ name: ':seven:', value: value, inline: false });
					break;
				case 7:
					embed.addFields({ name: ':eight:', value: value, inline: false });
					break;
				case 8:
					embed.addFields({ name: ':nine:', value: value, inline: false });
					break;
			}
		});
		// object to pass to .send()
		let msgobj = {
			content: ``,
			embeds: [embed],
		};
		// send
		let msg = await interaction.options
			.getChannel('channel', true)
			.send(msgobj);
		// react
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
