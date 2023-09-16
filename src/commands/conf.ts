/* eslint-disable indent */
import {
	ChannelType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	PermissionFlagsBits,
	SlashCommandBuilder
} from 'discord.js';
import { CommandHelpEntry } from '../struct/CommandHelpEntry';
import { GuildConfig } from '../struct/database';
import { TypedJsoning } from 'typed-jsoning';

export const data = new SlashCommandBuilder()
	.setName('conf')
	.setDescription('Configure DisCog for your server')
	.setDMPermission(false)
	.setDefaultMemberPermissions(
		PermissionFlagsBits.ManageGuild | PermissionFlagsBits.ViewAuditLog
	)
	.addSubcommand((subcommand) => {
		return subcommand
			.setName('auditlog')
			.setDescription('Configure the audit log')
			.addBooleanOption((option) => {
				return option
					.setName('enabled')
					.setDescription('Whether to enable the audit log')
					.setRequired(true);
			})
			.addChannelOption((option) => {
				return option
					.setName('channel')
					.setDescription('The channel to send audit logs to')
					.setRequired(false);
			});
	})
	.addSubcommand((subcommand) => {
		return subcommand
			.setName('birthdays')
			.setDescription('Configure the birthday announcements')
			.addBooleanOption((option) => {
				return option
					.setName('enabled')
					.setDescription('Whether to enable birthday announcements')
					.setRequired(true);
			})
			.addChannelOption((option) => {
				return option
					.setName('channel')
					.setDescription('The channel to send birthday announcements to')
					.setRequired(false);
			});
	})
	.addSubcommand((subcommand) => {
		return subcommand
			.setName('systemchannel')
			.setDescription('Configure the system messages channel')
			.addChannelOption((option) => {
				return option
					.setName('channel')
					.setDescription('The channel to send system messages to')
					.setRequired(false);
			});
	})
	.addSubcommand((subcommand) => {
		return subcommand
			.setName('welcome')
			.setDescription('Configure the welcome messages')
			.addBooleanOption((option) => {
				return option
					.setName('enabled')
					.setDescription('Whether to enable welcome messages')
					.setRequired(true);
			})
			.addChannelOption((option) => {
				return option
					.setName('channel')
					.setDescription('The channel to send welcome messages to')
					.setRequired(false);
			});
	})
	.addSubcommand((subcommand) => {
		return subcommand
			.setName('goodbye')
			.setDescription('Configure the goodbye messages')
			.addBooleanOption((option) => {
				return option
					.setName('enabled')
					.setDescription('Whether to enable goodbye messages')
					.setRequired(true);
			});
	});

// ! Make sure to add command to `coghelp.ts`

const db = new TypedJsoning<GuildConfig>('botfiles/guildconf.db.json'),
	handlers = {
		auditlog: async (interaction: ChatInputCommandInteraction) => {},
		birthdays: async (interaction: ChatInputCommandInteraction) => {},
		goodbye: async (interaction: ChatInputCommandInteraction) => {},
		systemchannel: async (interaction: ChatInputCommandInteraction) => {},
		welcome: async (interaction: ChatInputCommandInteraction) => {}
	};
export const execute = async (interaction: ChatInputCommandInteraction) => {
	const subcommand = interaction.options.getSubcommand();
	if (!subcommand) {
		await interaction.reply({
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
			],
			ephemeral: true
		});
		return;
	}
	const currentConfig = db.get(interaction.guildId!),
		guild = interaction.guild!;
	const bdayChannel = await (async () => {
		const birthdayChannels = (await guild.channels.fetch()).filter(
			(channel) => {
				return !!(
					((channel?.type == ChannelType.GuildAnnouncement ||
						channel?.type == ChannelType.GuildText) &&
						(channel?.name.toLowerCase().includes('bday') ||
							channel?.name.toLowerCase().includes('birthday') ||
							channel?.name.toLowerCase().includes('b-day'))) ||
					channel?.id == guild.systemChannel?.id
				);
			}
		);
		return birthdayChannels.first() ?? guild.systemChannel ?? null;
	})();
	let newConfig: GuildConfig = {},
		setDefaults = false;
	if (!currentConfig) {
		setDefaults = true;
		newConfig = {
			auditlog: {
				channel: null,
				enabled: false
			},
			greetings: {
				goodbyeEnabled: !!guild.systemChannel,
				welcome: {}
			},
			systemchannel: guild.systemChannel?.id
		};
		if (bdayChannel)
			newConfig.birthdays = {
				channel: bdayChannel.id,
				enabled: true
			};
		else newConfig.birthdays = { enabled: false };
		if (guild.systemChannel) {
			newConfig.greetings!.welcome!.enabled = true;
			newConfig.greetings!.welcome!.channel = guild.systemChannel.id;
		} else newConfig.greetings!.welcome!.enabled = false;
	}
};
