import {
	TextChannel,
	SlashCommandBuilder,
	PermissionFlagsBits,
	ChannelType,
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
			.addChannelTypes(ChannelType.GuildText)
			.setRequired(true);
	})
	.addStringOption((option) => {
		return option
			.setName('message')
			.setDescription('The message to be announced')
			.setRequired(true);
	})
	.addStringOption((option) => {
		return option
			.setName('mentions')
			.setDescription('Add all roles you want to ping')
			.setRequired(false);
	})
	.setDefaultMemberPermissions(
		PermissionFlagsBits.ManageGuild |
			PermissionFlagsBits.ManageMessages |
			PermissionFlagsBits.ManageEvents |
			PermissionFlagsBits.MentionEveryone |
			PermissionFlagsBits.ModerateMembers
	);
export const execute = async (interaction) => {
	let channel = interaction.options.getChannel('channel'),
		message = interaction.options.getString('message'),
		msgContent = interaction.options.getString('mentions');
	if (!channel || !(channel instanceof TextChannel) || !message) {
		throw new Error();
	}
	await interaction.deferReply();
	await channel.send({
		content: msgContent || undefined,
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
