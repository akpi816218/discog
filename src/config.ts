import {
	PermissionFlagsBits,
	PermissionsBitField,
	Snowflake
} from 'discord.js';
// % Production
export const applicationId: Snowflake = '1027383984675639348';
// % Development
// export const applicationId: Snowflake = '1034561538721325056';
export const clientId = applicationId;
export const permissionsBits = new PermissionsBitField().add(
	PermissionFlagsBits.AttachFiles,
	PermissionFlagsBits.CreateInstantInvite,
	PermissionFlagsBits.EmbedLinks,
	PermissionFlagsBits.ManageChannels,
	PermissionFlagsBits.ManageEvents,
	PermissionFlagsBits.ManageGuild,
	PermissionFlagsBits.ManageMessages,
	PermissionFlagsBits.ManageRoles,
	PermissionFlagsBits.MentionEveryone,
	PermissionFlagsBits.ModerateMembers,
	PermissionFlagsBits.ReadMessageHistory,
	PermissionFlagsBits.SendMessages,
	PermissionFlagsBits.SendMessagesInThreads,
	PermissionFlagsBits.ViewAuditLog,
	PermissionFlagsBits.ViewChannel
).bitfield;
