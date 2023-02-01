/* eslint-disable indent */
import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
	TextChannel,
	userMention
} from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('poll')
	.setDescription('Create a poll')
	.setDMPermission(false)
	// #region data
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
	.addBooleanOption((option) => {
		return option
			.setName('pingeveryone')
			.setDescription('Ping @everyone?')
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
	});
// #endregion data

export const execute = async (interaction: ChatInputCommandInteraction) => {
	// #region execute
	const options = [];
	// Create array of options
	for (let i = 1; i <= 9; i++) {
		if (i <= 2) options.push(interaction.options.getString(`option${i}`, true));
		else if (interaction.options.getString(`option${i}`, false))
			options.push(interaction.options.getString(`option${i}`, false));
	}
	// Create embed
	const embed = new EmbedBuilder()
		.setColor(0x00ff00)
		.setTimestamp()
		.setTitle(interaction.options.getString('question'))
		.setFooter({
			iconURL: interaction.client.user.displayAvatarURL(),
			text: 'Poll powered by DisCog'
		});
	// Populate embed with options
	options.forEach((value, index) => {
		// eslint-disable-next-line no-param-reassign
		if (!value) value = '';
		switch (index) {
			case 0:
				embed.addFields({ name: ':one:', value: value });
				break;
			case 1:
				embed.addFields({ name: ':two:', value: value });
				break;
			case 2:
				embed.addFields({ name: ':three:', value: value });
				break;
			case 3:
				embed.addFields({ name: ':four:', value: value });
				break;
			case 4:
				embed.addFields({ name: ':five:', value: value });
				break;
			case 5:
				embed.addFields({ name: ':six:', value: value });
				break;
			case 6:
				embed.addFields({ name: ':seven:', value: value });
				break;
			case 7:
				embed.addFields({ name: ':eight:', value: value });
				break;
			case 8:
				embed.addFields({ name: ':nine:', value: value });
				break;
		}
	});
	// Object to pass to .send()
	// eslint-disable-next-line prefer-const
	let msgobj = {
		content: '',
		embeds: [embed]
	};
	// Mention everyone?
	if (interaction.options.getBoolean('pingeveryone'))
		msgobj.content = `@everyone new poll by ${userMention(
			interaction.user.id
		)}`;
	else msgobj.content = `New poll by ${userMention(interaction.user.id)}`;
	// Send
	const channel = interaction.options.getChannel('channel');
	if (!channel) throw new Error();
	// eslint-disable-next-line no-extra-parens
	const msg = await (channel as TextChannel).send(msgobj);
	// React
	options.forEach(async (_value, index) => {
		switch (index) {
			case 0:
				await msg.react('1️⃣');
				break;
			case 1:
				await msg.react('2️⃣');
				break;
			case 2:
				await msg.react('3️⃣');
				break;
			case 3:
				await msg.react('4️⃣');
				break;
			case 4:
				await msg.react('5️⃣');
				break;
			case 5:
				await msg.react('6️⃣');
				break;
			case 6:
				await msg.react('7️⃣');
				break;
			case 7:
				await msg.react('8️⃣');
				break;
			case 8:
				await msg.react('9️⃣');
				break;
		}
	});
	interaction.reply('Done.');
	// #endregion execute
};
export default {
	data,
	execute
};
