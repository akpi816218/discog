import {
	PermissionFlagsBits,
	PermissionsBitField,
	Snowflake
} from 'discord.js';
// % Production
// export const applicationId: Snowflake = '1150536178714554459';
// % Development
export const applicationId: Snowflake = '1034561538721325056';
export const clientId = applicationId;
export const permissionsBits = new PermissionsBitField().add(
	PermissionFlagsBits.AddReactions,
	PermissionFlagsBits.Administrator,
	PermissionFlagsBits.AttachFiles,
	PermissionFlagsBits.CreateInstantInvite,
	PermissionFlagsBits.EmbedLinks,
	PermissionFlagsBits.ManageChannels,
	PermissionFlagsBits.ManageEvents,
	PermissionFlagsBits.ManageGuild,
	PermissionFlagsBits.ManageMessages,
	PermissionFlagsBits.ManageRoles,
	PermissionFlagsBits.ManageThreads,
	PermissionFlagsBits.ManageWebhooks,
	PermissionFlagsBits.MentionEveryone,
	PermissionFlagsBits.ModerateMembers,
	PermissionFlagsBits.ReadMessageHistory,
	PermissionFlagsBits.SendMessages,
	PermissionFlagsBits.SendMessagesInThreads,
	PermissionFlagsBits.ViewAuditLog,
	PermissionFlagsBits.ViewChannel
).bitfield;
export const PORT = 8000;
