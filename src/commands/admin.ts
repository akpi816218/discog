/* eslint-disable indent */
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	EmbedBuilder,
	Guild,
	PermissionFlagsBits,
	SlashCommandBuilder,
	bold,
	roleMention,
	underscore,
	userMention
} from 'discord.js';
import { CommandHelpEntry } from '../struct/CommandHelpEntry';

export const data = new SlashCommandBuilder()
	.setName('admin')
	.setDescription('Automatically run admin tasks')
	.setDMPermission(false)
	.setDefaultMemberPermissions(
		PermissionFlagsBits.ManageGuild |
			PermissionFlagsBits.ManageRoles |
			PermissionFlagsBits.ModerateMembers
	)
	.addSubcommandGroup((subcommandGroup) => {
		return subcommandGroup
			.setName('addrole')
			.setDescription('Add a role to users')
			.addSubcommand((subcommand) => {
				return subcommand
					.setName('all')
					.setDescription('Add a role to all users')
					.addRoleOption((option) => {
						return option
							.setName('role')
							.setDescription('Role to add')
							.setRequired(true);
					});
			})
			.addSubcommand((subcommand) => {
				return subcommand
					.setName('humans')
					.setDescription('Add a role to all humans')
					.addRoleOption((option) => {
						return option
							.setName('role')
							.setDescription('Role to add')
							.setRequired(true);
					});
			})
			.addSubcommand((subcommand) => {
				return subcommand
					.setName('bots')
					.setDescription('Add a role to all bots')
					.addRoleOption((option) => {
						return option
							.setName('role')
							.setDescription('Role to add')
							.setRequired(true);
					});
			});
	})
	.addSubcommand((subcommand) => {
		return subcommand
			.setName('lockchannel')
			.setDescription('Lock a channel')
			.addChannelOption((option) => {
				return option
					.setName('channel')
					.setDescription('Channel to (un)lock')
					.setRequired(true);
			})
			.addBooleanOption((option) => {
				return option
					.setName('unlock')
					.setDescription('Unlock? (Default: lock)')
					.setRequired(true);
			});
	});

// ! Make sure to add command to `coghelp.ts`

export const handlers = {
	addrole: {
		all: async (interaction: ChatInputCommandInteraction) => {
			const bad = [],
				good = [],
				guild = interaction.guild as Guild,
				role = interaction.options.getRole('role', true);
			for (const [, member] of (await guild.members.fetch())[
				Symbol.iterator
			]()) {
				if (member.manageable) {
					await member.roles.add(role.id);
					good.push(member);
				} else bad.push(member);
			}
			await interaction.editReply({
				allowedMentions: { parse: [] },
				content: `Added role ${roleMention(role.id)} to following users:\n${good
					.map((u) => userMention(u.id))
					.join(', ')}\nFailed to add role to following users:\n${bad
					.map((u) => userMention(u.id))
					.join(', ')})`
			});
		},
		bots: async (interaction: ChatInputCommandInteraction) => {
			const bad = [],
				good = [],
				guild = interaction.guild as Guild,
				role = interaction.options.getRole('role', true);
			for (const [, member] of (await guild.members.fetch())[
				Symbol.iterator
			]()) {
				if (member.user.bot && member.manageable) {
					await member.roles.add(role.id);
					good.push(member);
				} else if (member.user.bot) bad.push(member);
				await interaction.editReply({
					allowedMentions: { parse: [] },
					content: `Added role ${roleMention(
						role.id
					)} to following bot users:\n${good
						.map((u) => userMention(u.id))
						.join(', ')}\nFailed to add role to following bot users:\n${bad
						.map((u) => userMention(u.id))
						.join(', ')})`
				});
			}
		},
		humans: async (interaction: ChatInputCommandInteraction) => {
			const bad = [],
				good = [],
				guild = interaction.guild as Guild,
				role = interaction.options.getRole('role', true);
			for (const [, member] of (await guild.members.fetch())[
				Symbol.iterator
			]()) {
				if (!member.user.bot && member.manageable) {
					await member.roles.add(role.id);
					good.push(member);
				} else if (!member.user.bot) bad.push(member);
				await interaction.editReply({
					allowedMentions: { parse: [] },
					content: `Added role ${roleMention(
						role.id
					)} to following human users:\n${good
						.map((u) => userMention(u.id))
						.join(', ')}\nFailed to add role to following human users:\n${bad
						.map((u) => userMention(u.id))
						.join(', ')})`
				});
			}
		}
	},
	channel: {
		clear: async (interaction: ChatInputCommandInteraction) => {
			await interaction.deferReply({ ephemeral: true });
			if (!interaction.inGuild()) {
				await interaction.editReply(
					'Error: cannot clear this channel.\nCause: not in a guild.'
				);
				return;
			}
			// No need for permission check because command is already restricted to admins and reply is ephemeral
			const reply = await interaction.editReply({
				components: [
					new ActionRowBuilder<ButtonBuilder>().setComponents(
						new ButtonBuilder()
							.setCustomId('/admin_channel_clear')
							.setLabel('Clear Channel')
							.setStyle(ButtonStyle.Danger)
							.setEmoji('⚠')
							.setDisabled(true)
					)
				],
				content: `${underscore(
					bold(
						'Are you sure you want to clear this channel? This action is irreversible! Please make sure that you are absolutely sure you want to clear this channel.'
					)
				)}\nClick the button below to confirm.\nPlease wait 10 seconds to consider your decision.`
			});
			setTimeout(async () => {
				await reply.edit({
					components: [
						new ActionRowBuilder<ButtonBuilder>().setComponents(
							new ButtonBuilder()
								.setCustomId('/admin_channel_clear')
								.setLabel('Clear Channel')
								.setStyle(ButtonStyle.Danger)
								.setEmoji('⚠')
								.setDisabled(false)
						)
					],
					content: `${underscore(
						bold(
							'Are you sure you want to clear this channel? This action is irreversible! Please make sure that you are absolutely sure you want to clear this channel.'
						)
					)}\nClick the button below to confirm.`
				});
			}, 10_000);
		},
		lock: async (interaction: ChatInputCommandInteraction) => {
			await interaction.deferReply();
			if (!interaction.guild) {
				await interaction.editReply(
					'Error: cannot lock/unlock this channel.\nCause: not in a guild.'
				);
				return;
			}
			const channel = await interaction.guild.channels.fetch(
					interaction.options.getChannel('channel', true).id
				),
				unlock = interaction.options.getBoolean('unlock', false);
			if (
				!channel ||
				channel.isDMBased() ||
				channel.isVoiceBased() ||
				!channel.isTextBased() ||
				channel.isThread()
			) {
				await interaction.editReply(
					'Error: cannot lock/unlock this channel.\nCause may be insufficient permissions or invalid channel type.'
				);
				return;
			}
			if (!unlock) {
				await channel.permissionOverwrites.edit(
					interaction.guild.roles.everyone,
					{
						AddReactions: false,
						AttachFiles: false,
						CreateInstantInvite: false,
						CreatePrivateThreads: false,
						CreatePublicThreads: false,
						EmbedLinks: false,
						ManageMessages: false,
						ManageThreads: false,
						ReadMessageHistory: true,
						SendMessages: false,
						SendMessagesInThreads: false,
						SendTTSMessages: false,
						SendVoiceMessages: false,
						Speak: false,
						UseApplicationCommands: false,
						ViewChannel: true
					}
				);
			} else {
				await channel.permissionOverwrites.edit(
					interaction.guild.roles.everyone,
					{
						AddReactions: null,
						AttachFiles: null,
						CreateInstantInvite: null,
						CreatePrivateThreads: null,
						CreatePublicThreads: null,
						EmbedLinks: null,
						ManageMessages: null,
						ManageThreads: null,
						ReadMessageHistory: null,
						SendMessages: null,
						SendMessagesInThreads: null,
						SendTTSMessages: null,
						SendVoiceMessages: null,
						Speak: null,
						UseApplicationCommands: null,
						ViewChannel: null
					}
				);
			}
		}
	}
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
	const subcommandGroup = interaction.options.getSubcommandGroup() as
		| keyof typeof handlers
		| null;
	await interaction.deferReply({
		ephemeral: !subcommandGroup && !interaction.options.getSubcommand()
	});
	switch (subcommandGroup) {
		case 'addrole':
			const subcommanda = interaction.options.getSubcommand(
				true
			) as keyof typeof handlers.addrole;
			await handlers.addrole[subcommanda](interaction);
			break;
		case 'channel':
			const subcommandc = interaction.options.getSubcommand(
				true
			) as keyof typeof handlers.channel;
			await handlers.channel[subcommandc](interaction);
			break;
		case null:
			await interaction.editReply({
				embeds: [
					new EmbedBuilder().setFields(
						new CommandHelpEntry('admin', 'Automatically run admin tasks', [
							'admin addrole all <role>',
							'admin addrole bots <role>',
							'admin addrole humans <role>',
							'admin channel lock <channel> [unlock: boolean | false]',
							'admin channel clear'
						]).toDiscordAPIEmbedField()
					)
				]
			});
			break;
	}
	await interaction.reply({
		embeds: [
			new EmbedBuilder().setFooter({
				iconURL: interaction.client.user.displayAvatarURL(),
				text: 'Powered by DisCog'
			})
		]
	});
};
