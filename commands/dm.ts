import {
	ChatInputCommandInteraction,
	EmbedAssertions,
	EmbedBuilder,
	GuildMember,
	PermissionFlagsBits,
	SlashCommandBuilder,
	User,
	userMention,
} from 'discord.js';
('use strict');
export const data = new SlashCommandBuilder()
	.setName('dm')
	.setDescription('Send an official server message to a user via DMs')
	.addUserOption((option) => {
		return option
			.setName('user')
			.setDescription('DM an official server message to a user')
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

// ! edit entry in `help.ts`

export const execute = async (interaction: ChatInputCommandInteraction) => {
	let admin = interaction.member as GuildMember,
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
						value: `${admin.user.tag} (${userMention(admin.user.id)})`,
					},
					{
						name: 'Message',
						value: interaction.options.getString('message') as string,
					}
				)
				.setFooter({
					text: 'Powered by DisCog',
					iconURL: interaction.client.user.displayAvatarURL(),
				}),
		],
	});
	await interaction.reply({ content: 'Done.', ephemeral: true });
};
export default {
	data,
	execute,
};
