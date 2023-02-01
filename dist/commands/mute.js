import {
	EmbedBuilder,
	PermissionFlagsBits,
	SlashCommandBuilder,
	userMention
} from 'discord.js';
import Jsoning from 'jsoning';
const db = new Jsoning('botfiles/mute.db.json');
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
export const execute = async (interaction) => {
	await interaction.deferReply();
	if (!interaction.guild) return;
	const member = await interaction.guild.members.fetch(
			// eslint-disable-next-line no-extra-parens
			interaction.options.getUser('user').id
		),
		// eslint-disable-next-line no-extra-parens
		user = await interaction.member.fetch(true);
	await interaction.guild.fetch();
	if (!member.manageable) {
		await interaction.reply({
			// eslint-disable-next-line quotes
			content: "I can't manage that user.",
			ephemeral: true
		});
		return;
	} else if (
		// eslint-disable-next-line no-extra-parens
		user.roles.highest.position <=
		// eslint-disable-next-line no-extra-parens
		member.roles.highest.position
	) {
		await interaction.reply({
			// eslint-disable-next-line quotes
			content: "You can't manage that user",
			ephemeral: true
		});
		return;
	} else {
		const guildObj = db.get(member.guild.id),
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
							iconURL: interaction.client.user.displayAvatarURL(),
							text: 'Powered by DisCog'
						})
				],
				ephemeral: true
			});
			return;
		}
		const currentRoles = [];
		member.roles.cache.forEach((role) => currentRoles.push(role.id));
		Object.defineProperty(guildObj, member.id, currentRoles);
		await member.roles.set([]);
		await db.set(interaction.guild.id, guildObj);
		member.roles.add(member.guild.roles.cache.at(1));
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle('User Muted')
					.addFields(
						{ name: 'Acting User:', value: userMention(user.id) },
						{ name: 'Muted User:', value: userMention(member.id) }
					)
					.setFooter({
						iconURL: interaction.client.user.displayAvatarURL(),
						text: 'Powered by DisCog'
					})
			]
		});
	}
};
export default {
	data,
	execute
};
