import {
	channelMention,
	ChatInputCommandInteraction,
	EmbedBuilder,
	GuildVerificationLevel,
	SlashCommandBuilder,
	userMention,
} from 'discord.js';
('use strict');
export const data = new SlashCommandBuilder()
	.setName('guildinfo')
	.setDescription('Get some guild info')
	.setDMPermission(false);

// ! Make sure to add command to `coghelp.ts`

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.deferReply();
	if (!interaction.guild) {
		await interaction.followUp('Error: Not in a guild');
		return;
	}
	let guild = await interaction.guild.fetch();
	if (!guild.available) {
		await interaction.followUp('Internal error: Guild not available');
		return;
	}
	await interaction.followUp({
		embeds: [
			new EmbedBuilder()
				.setTitle('Guild Info')
				.addFields(
					{ name: 'Name', value: guild.name },
					{ name: 'Description', value: guild.description || 'None' },
					{ name: 'Guild ID', value: guild.id },
					{ name: 'Member Count', value: guild.memberCount.toString() },
					{
						name: 'Owner',
						value: `${(await guild.fetchOwner()).user.tag} (${userMention(
							guild.ownerId
						)})`,
					},
					{
						name: 'Created At',
						value: guild.createdAt.toLocaleString(guild.preferredLocale),
					},
					{
						name: 'System Channel',
						value: guild.systemChannel
							? channelMention(guild.systemChannel.id)
							: 'None',
					},
					{
						name: 'Rules Channel',
						value: guild.rulesChannel
							? channelMention(guild.rulesChannel.name)
							: 'None',
					},
					{
						name: 'AFK Channel',
						value: guild.afkChannel
							? channelMention(guild.afkChannel.name)
							: 'None',
					},
					{
						name: 'Public Updates Channel',
						value: guild.publicUpdatesChannelId
							? channelMention(guild.publicUpdatesChannelId)
							: 'None',
					}
				)
				.setThumbnail(guild.iconURL())
				.setFooter({
					text: 'Powered by DisCog',
					iconURL: interaction.client.user.displayAvatarURL(),
				}),
		],
	});
};
export default {
	data,
	execute,
};
