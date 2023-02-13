import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	GuildMember,
	PermissionFlagsBits,
	SlashCommandBuilder,
	User,
	userMention
} from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('dm')
	.setDescription('Send an official server message to a user via DMs')
	.addUserOption((option) => {
		return option
			.setName('user')
			.setDescription('The target user')
			.setRequired(true);
	})
	.addStringOption((option) => {
		return option
			.setName('message')
			.setDescription('The message to send')
			.setRequired(true);
	})
	.setDMPermission(false)
	.setDefaultMemberPermissions(
		PermissionFlagsBits.ManageGuild & PermissionFlagsBits.ModerateMembers
	);

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.deferReply();
	const admin = interaction.member as GuildMember,
		// eslint-disable-next-line no-extra-parens
		dm = await (interaction.options.getUser('user') as User).createDM();
	await dm.send({
		embeds: [
			new EmbedBuilder()
				.setTitle('Server DM')
				.setDescription(
					'You have recieved an official server message from a server moderator/administrator.'
				)
				.addFields(
					{ name: 'Server Name:', value: admin.guild.name },
					{
						name: 'Sent by:',
						value: `${admin.user.tag} (${userMention(admin.user.id)})`
					},
					{
						name: 'Message',
						value: interaction.options.getString('message') as string
					}
				)
				.setFooter({
					iconURL: interaction.client.user.displayAvatarURL(),
					text: 'Powered by DisCog'
				})
		]
	});
	await interaction.reply({ content: 'Done.', ephemeral: true });
};
export default {
	data,
	execute
};
