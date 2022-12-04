import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	Guild,
	GuildMember,
	GuildMemberRoleManager,
	PermissionFlagsBits,
	Role,
	SlashCommandBuilder,
	User,
	userMention,
} from 'discord.js';
import Jsoning from 'jsoning';
('use strict');
const db = new Jsoning('mute.db.json');
export const data = new SlashCommandBuilder()
	.setName('mute')
	.setDescription('Mute/unmute a user')
	.addUserOption((option) => {
		return option
			.setName('user')
			.setDescription('The user to mute')
			.setRequired(true);
	})
	.setDefaultMemberPermissions(
		PermissionFlagsBits.Administrator |
			PermissionFlagsBits.ModerateMembers |
			PermissionFlagsBits.ManageGuild
	)
	.setDMPermission(false);

export const execute = async (interaction: ChatInputCommandInteraction) => {
	let user = await (interaction.member as GuildMember).fetch(true),
		member = await (interaction.guild as Guild).members.fetch(
			(interaction.options.getUser('user') as User).id
		);
	await (interaction.guild as Guild).fetch();
	if (!member.manageable) {
		await interaction.reply({
			content: "I can't manage that user.",
			ephemeral: true,
		});
		return;
	} else if (
		(user.roles as GuildMemberRoleManager).highest.position <=
		(member.roles as GuildMemberRoleManager).highest.position
	) {
		await interaction.reply({
			content: "You can't manage that user",
			ephemeral: true,
		});
		return;
	} else {
		let guildObj = db.get(member.guild.id),
			roles = guildObj[member.id];
		if (Object.keys(roles).length != 0) {
			await member.roles.set(guildObj[member.id]);
			delete guildObj[member.id];
			await db.set(member.guild.id, guildObj);
			await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle('User Unmuted')
						.addFields(
							{ name: 'Acting User:', value: userMention(user.id) },
							{ name: 'Unmuted User:', value: userMention(member.id) }
						)
						.setFooter({
							text: 'Powered by DisCog',
							iconURL: interaction.client.user.displayAvatarURL(),
						}),
				],

				ephemeral: true,
			});
			return;
		}
		let currentRoles: Array<string> = [];
		member.roles.cache.forEach((role) => currentRoles.push(role.id));
		Object.defineProperty(guildObj, member.id, currentRoles);
		await member.roles.set([]);
		await db.set((interaction.guild as Guild).id, guildObj);
		member.roles.add(member.guild.roles.cache.at(1) as Role);
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle('User Muted')
					.addFields(
						{ name: 'Acting User:', value: userMention(user.id) },
						{ name: 'Muted User:', value: userMention(member.id) }
					)
					.setFooter({
						text: 'Powered by DisCog',
						iconURL: interaction.client.user.displayAvatarURL(),
					}),
			],
		});
	}
};
export default {
	data,
	execute,
};
