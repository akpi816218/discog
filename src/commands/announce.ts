import {
	BaseGuildTextChannel,
	ChannelType,
	ChatInputCommandInteraction,
	PermissionFlagsBits,
	SlashCommandBuilder
} from 'discord.js';

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
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.deferReply();
	const channel = interaction.options.getChannel('channel'),
		message = interaction.options.getString('message'),
		msgContent = interaction.options.getString('mentions');
	if (!channel || !(channel instanceof BaseGuildTextChannel) || !message) {
		throw new Error();
	}
	await channel.send({
		content: msgContent || undefined,
		embeds: [
			{
				color: 0x00ff00,
				description: message,
				footer: {
					// eslint-disable-next-line camelcase
					icon_url: interaction.client.user.displayAvatarURL(),
					text: 'Powered by DisCog'
				},
				title: `Announcement by @${interaction.user.username}:`
			}
		]
	});
	await interaction.editReply({
		content: 'Done.'
	});
};
