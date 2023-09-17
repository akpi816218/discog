// ! Remove the `/* eslint-disable no-extra-parens */` while editing this file
/* eslint-disable no-extra-parens */
/* eslint-disable indent */
import { BaseGuildConfig, PopulatedGuildConfig } from '../struct/database';
import {
	ChannelType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	PermissionFlagsBits,
	SlashCommandBuilder,
	bold,
	inlineCode,
	underscore
} from 'discord.js';
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
			.setName('greetings')
			.setDescription('Configure the greeting messages')
			.addBooleanOption((option) => {
				return option
					.setName('welcome')
					.setDescription('Whether to enable welcome messages')
					.setRequired(true);
			})
			.addBooleanOption((option) => {
				return option
					.setName('goodbye')
					.setDescription('Whether to enable goodbye messages')
					.setRequired(true);
			})
			.addChannelOption((option) => {
				return option
					.setName('channel')
					.setDescription('The channel to send welcome and goodbye messages to')
					.setRequired(false);
			});
	});

const db = new TypedJsoning<BaseGuildConfig>('botfiles/guildconf.db.json'),
	handlers = {
		auditlog: async (
			interaction: ChatInputCommandInteraction,
			setDefaults: boolean,
			config: PopulatedGuildConfig
		): Promise<PopulatedGuildConfig> => {
			const channel = interaction.options.getChannel('channel', false),
				enabled = interaction.options.getBoolean('enabled', true);
			if (enabled && channel)
				config.auditlog = {
					channel: channel.id,
					enabled
				};
			else if (enabled && !channel) {
				await interaction.editReply(
					'You must provide a channel to enable audit logs'
				);
				return config;
			} else if (!enabled)
				config.auditlog = {
					channel: null,
					enabled
				};
			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setTitle('Audit Log Configuration')
						.setDescription(
							`This is the server audit log configuration. DisCog will send messages to the selected channel everytime a noteworthy event is detected as long as the option is enabled.${
								setDefaults
									? bold(
											`\n\nSince this server had no prior data, the defaults have been calculated and set. You can view the current settings at any time by running ${inlineCode(
												'/conf'
											)}`
									  )
									: null
							}`
						)
						.setFields(
							{
								name: 'Enabled',
								value: config.auditlog.enabled.toString()
							},
							{
								name: 'Channel',
								value: config.auditlog.channel ?? 'None'
							}
						)
				]
			});
			return config;
		},
		birthdays: async (
			interaction: ChatInputCommandInteraction,
			setDefaults: boolean,
			config: PopulatedGuildConfig
		): Promise<PopulatedGuildConfig> => {
			const channel = interaction.options.getChannel('channel', false),
				enabled = interaction.options.getBoolean('enabled', true);
			if (enabled && channel)
				config.birthdays = {
					channel: channel.id,
					enabled
				};
			else if (enabled && !channel) {
				await interaction.editReply(
					'You must provide a channel to enable birthday announcements'
				);
				return config;
			} else if (!enabled)
				config.birthdays = {
					channel: null,
					enabled
				};
			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setTitle('Birthday Announcement Configuration')
						.setDescription(
							`This is the server's birthday announcement configuration. DisCog will announce birthdays in the selected channel as long as the option is enabled.${
								setDefaults
									? bold(
											`\n\nSince this server had no prior data, the defaults have been calculated and set. You can view the current settings at any time by running ${inlineCode(
												'/conf'
											)}`
									  )
									: null
							}`
						)
						.setFields(
							{
								name: 'Enabled',
								value: config.birthdays.enabled.toString()
							},
							{
								name: 'Channel',
								value: config.birthdays.channel ?? 'None'
							}
						)
				]
			});
			return config;
		},
		greetings: async (
			interaction: ChatInputCommandInteraction,
			setDefaults: boolean,
			config: PopulatedGuildConfig
		): Promise<PopulatedGuildConfig> => {
			const channel =
					interaction.options.getChannel('channel', false) ??
					(config.greetings.channel
						? await interaction.guild!.channels.fetch(config.greetings.channel)
						: null),
				goodbye = interaction.options.getBoolean('goodbye', true),
				welcome = interaction.options.getBoolean('welcome', true);
			if (goodbye && channel)
				config.greetings = {
					channel: channel.id,
					goodbyeEnabled: goodbye,
					welcomeEnabled: welcome
				};
			else if (welcome && channel)
				config.greetings = {
					channel: channel.id,
					goodbyeEnabled: goodbye,
					welcomeEnabled: welcome
				};
			else if ((welcome || goodbye) && !channel)
				await interaction.editReply(
					'You must provide a channel to enable greeting messages'
				);
			else if (!welcome && !goodbye)
				config.greetings = {
					channel: null,
					goodbyeEnabled: goodbye,
					welcomeEnabled: welcome
				};
			else {
				await interaction.editReply(
					'An error occured while configuring the greeting messages. Please contact the developer for assistance.'
				);
				return config;
			}
			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setTitle('Goodbye Message Configuration')
						.setDescription(
							`This is the server's goodbye message configuration. DisCog will send goodbye messages to the selected channel as long as the option is enabled.${
								setDefaults
									? bold(
											`\n\nSince this server had no prior data, the defaults have been calculated and set. You can view the current settings at any time by running ${inlineCode(
												'/conf'
											)}`
									  )
									: null
							}`
						)
						.setFields(
							{
								name: 'Enabled',
								value: config.greetings.goodbyeEnabled.toString()
							},
							{
								name: 'Channel',
								value: config.greetings.channel ?? 'None'
							}
						)
				]
			});
			return config;
		},
		null: async (
			interaction: ChatInputCommandInteraction,
			setDefaults: boolean,
			config: PopulatedGuildConfig
		): Promise<PopulatedGuildConfig> => {
			await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle('Configuration Information')
						.setDescription(
							`Configure DisCog for your server\n${inlineCode(
								'/conf auditlog <enabled: boolean> [channel: channel]'
							)}\n${inlineCode(
								'/conf birthdays <enabled: boolean> [channel: channel]'
							)}\n${inlineCode(
								'/conf greetings <welcome: boolean> <goodbye: boolean> [channel: channel]'
							)}${
								setDefaults
									? `\n\n${bold(
											'Since this server had no prior data, the defaults have been calculated and set.'
									  )}`
									: null
							}\n\n${underscore(bold('Current Configuration:'))}`
						)
						.setFields(
							{
								name: 'Audit Log — Enabled',
								value: config.auditlog.enabled.toString()
							},
							{
								name: 'Audit Log — Channel',
								value: config.auditlog.channel ?? 'None'
							},
							{
								name: 'Birthday Announcements — Enabled',
								value: config.birthdays.enabled.toString()
							},
							{
								name: 'Birthday Announcements — Channel',
								value: config.birthdays.channel ?? 'None'
							},
							{
								name: 'Welcome Messages — Enabled',
								value: config.greetings.welcomeEnabled.toString()
							},
							{
								name: 'Goodbye Messages — Enabled',
								value: config.greetings.goodbyeEnabled.toString()
							},
							{
								name: 'Welcome/Goodbye Messages — Channel',
								value: config.greetings.channel ?? 'None'
							},
							{
								name: 'System Messages — Channel',
								value: config.systemchannel ?? 'None'
							}
						)
				]
			});
			return config;
		},
		systemchannel: async (
			interaction: ChatInputCommandInteraction,
			setDefaults: boolean,
			config: PopulatedGuildConfig
		): Promise<PopulatedGuildConfig> => {
			const channel = interaction.options.getChannel('channel', false);
			if (channel) config.systemchannel = channel.id;
			else config.systemchannel = null;
			await interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setTitle('System Messages Configuration')
						.setDescription(
							`This is the server's system messages configuration. DisCog will send system messages to the selected channel.${
								setDefaults
									? bold(
											`\n\nSince this server had no prior data, the defaults have been calculated and set. You can view the current settings at any time by running ${inlineCode(
												'/conf'
											)}`
									  )
									: null
							}`
						)
						.setFields({
							name: 'Channel',
							value: config.systemchannel ?? 'None'
						})
				]
			});
			return config;
		}
	};
export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.deferReply();
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
	let newConfig: BaseGuildConfig = {},
		setDefaults = false;
	if (!currentConfig) {
		setDefaults = true;
		newConfig = {
			auditlog: {
				channel: null,
				enabled: false
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
			newConfig.greetings!.welcomeEnabled = true;
			newConfig.greetings!.goodbyeEnabled = true;
			newConfig.greetings!.channel = guild.systemChannel.id;
		} else newConfig.greetings!.welcomeEnabled = false;
	} else {
		newConfig = currentConfig;
		if (!newConfig.birthdays) {
			if (bdayChannel)
				newConfig.birthdays = {
					channel: bdayChannel.id,
					enabled: true
				};
			else newConfig.birthdays = { enabled: false };
		}
		if (!newConfig.greetings) {
			if (guild.systemChannel) {
				newConfig.greetings!.welcomeEnabled = true;
				newConfig.greetings!.goodbyeEnabled = true;
				newConfig.greetings!.channel = guild.systemChannel.id;
			} else {
				newConfig.greetings!.welcomeEnabled = false;
				newConfig.greetings!.goodbyeEnabled = false;
				newConfig.greetings!.channel = null;
			}
		}
		if (!newConfig.systemchannel)
			newConfig.systemchannel = guild.systemChannel?.id ?? null;
		if (!newConfig.auditlog) {
			newConfig.auditlog = newConfig.systemchannel
				? {
						channel: newConfig.systemchannel,
						enabled: true
				  }
				: {
						channel: null,
						enabled: false
				  };
		}
	}
	const subcommand = interaction.options.getSubcommandGroup() as
		| keyof typeof handlers
		| null;
	const finalConfig = subcommand
		? await handlers[subcommand](
				interaction,
				setDefaults,
				newConfig as PopulatedGuildConfig
		  )
		: await handlers.null(
				interaction,
				setDefaults,
				newConfig as PopulatedGuildConfig
		  );
	await db.set(interaction.guildId!, finalConfig);
};