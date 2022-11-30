import {
	TextChannel,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	PermissionFlagsBits,
} from 'discord.js';
('use strict');
export const data = new SlashCommandBuilder()
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
	})
	.setDefaultMemberPermissions(
		PermissionFlagsBits.ManageGuild |
			PermissionFlagsBits.ManageMessages |
			PermissionFlagsBits.ManageEvents |
			PermissionFlagsBits.MentionEveryone |
			PermissionFlagsBits.ModerateMembers
	);

export const execute = async (interaction: ChatInputCommandInteraction) => {
	let msgContent = 'Pay attention.';
	if (interaction.options.getBoolean('mention')) {
		msgContent = '@everyone pay attention.';
	}
	let channel = interaction.options.getChannel('channel'),
		message = interaction.options.getString('message');
	if (!channel || !(channel instanceof TextChannel) || !message) {
		throw new Error();
	}
	await channel.send({
		content: msgContent,
		embeds: [
			{
				color: 0x00ff00,
				title: `Announcement by @${interaction.user.tag}:`,
				description: message,
				footer: {
					text: 'Powered by DisCog',
					icon_url: interaction.client.user.displayAvatarURL(),
				},
			},
		],
	});
	await interaction.reply({
		content: 'Done.',
		ephemeral: true,
	});
};
export default {
	data,
	execute,
};
