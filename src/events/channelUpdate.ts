import {
	BaseGuildTextChannel,
	BaseGuildVoiceChannel,
	ChannelType,
	DMChannel,
	EmbedBuilder,
	Events,
	ForumChannel,
	ForumLayoutType,
	GuildChannel,
	PrivateThreadChannel,
	PublicThreadChannel,
	SortOrderType,
	StageChannel,
	VideoQualityMode,
	channelMention
} from 'discord.js';
import { BaseGuildConfig } from '../struct/database';
import TypedJsoning from 'typed-jsoning';

export const name = Events.ChannelUpdate;
export const once = false;

const db = new TypedJsoning<BaseGuildConfig>('botfiles/guildconf.db.json');
export const execute = async (
	before: DMChannel | GuildChannel,
	after: DMChannel | GuildChannel
) => {
	if (before instanceof DMChannel || after instanceof DMChannel) return;
	const config = db.get(after.guild.id);
	if (!config?.auditlog?.enabled || !config?.auditlog?.channel) return;
	const auditlogChannel = after.guild.channels.cache.get(
		config.auditlog.channel
	);
	if (!auditlogChannel || !auditlogChannel.isTextBased()) return;

	// eslint-disable-next-line no-param-reassign
	before = await before.fetch();
	// eslint-disable-next-line no-param-reassign
	after = await after.fetch();

	const embed = new EmbedBuilder()
		.setTitle('Channel Updated')
		.setDescription(channelMention(after.id))
		.setTimestamp()
		.setColor(0xff0000);

	const differentProperties = getDifferentProperties(before, after);

	if (differentProperties.name)
		embed.addFields({
			name: 'Name',
			value: `\`${before.name}\` => \`${after.name}\``
		});
	if (differentProperties.type)
		embed.addFields({
			name: 'Type',
			value: `\`${ChannelType[differentProperties.type]}\``
		});
	if (differentProperties.parent)
		embed.addFields({
			name: 'Parent Category',
			value: `\`${before.parent?.name ?? 'None'}\` => \`${
				after.parent?.name ?? 'None'
			}\``
		});
	if (differentProperties.position) {
		embed.addFields({
			name: 'Position',
			value: `\`${before.position}\` => \`${after.position}\``
		});
	}

	if (
		after instanceof BaseGuildVoiceChannel &&
		before instanceof BaseGuildVoiceChannel
	) {
		const dp = differentProperties as Partial<BaseGuildVoiceChannel>;
		if (dp.bitrate)
			embed.addFields({
				name: 'Bitrate',
				value: `\`${before.bitrate}\` => \`${after.bitrate}\``
			});
		if (dp.full)
			embed.addFields({
				name: 'Full',
				value: `\`${before.full}\` => \`${after.full}\``
			});
		if (dp.userLimit)
			embed.addFields({
				name: 'User Limit',
				value: `\`${before.userLimit}\` => \`${after.userLimit}\``
			});
		if (dp.videoQualityMode)
			embed.addFields({
				name: 'Video Quality Mode',
				value: `\`${
					before.videoQualityMode
						? VideoQualityMode[before.videoQualityMode]
						: 'None'
				}\` => \`${
					after.videoQualityMode
						? VideoQualityMode[after.videoQualityMode]
						: 'None'
				}\``
			});
		if (dp.rtcRegion)
			embed.addFields({
				name: 'RTC Region',
				value: `\`${before.rtcRegion ?? 'Auto'}\` => \`${
					after.rtcRegion ?? 'Auto'
				}\``
			});
		if (before instanceof StageChannel && after instanceof StageChannel) {
			const dp = differentProperties as Partial<StageChannel>;
			if (dp.topic)
				embed.addFields({
					name: 'Topic',
					value: `\`${after.topic ?? 'None'}\` => \`${before.topic ?? 'None'}\``
				});
			if (dp.rateLimitPerUser)
				embed.addFields({
					name: 'Slowmode Rate Limit',
					value: `\`${before.rateLimitPerUser}\` => \`${after.rateLimitPerUser}\``
				});
		}
	}
	if (
		before instanceof BaseGuildTextChannel &&
		after instanceof BaseGuildTextChannel
	) {
		const dp = differentProperties as Partial<BaseGuildTextChannel>;
		if (dp.topic)
			embed.addFields({
				name: 'Topic',
				value: `\`${after.topic ?? 'None'}\` => \`${before.topic ?? 'None'}\``
			});
		if (dp.nsfw)
			embed.addFields({
				name: 'NSFW',
				value: `\`${before.nsfw}\` => \`${after.nsfw}\``
			});
		if (dp.rateLimitPerUser)
			embed.addFields({
				name: 'Slowmode Rate Limit',
				value: `\`${before.rateLimitPerUser}\` => \`${after.rateLimitPerUser}\``
			});
		if (after.isThread() && before.isThread()) {
			const dp = differentProperties as Partial<
				PrivateThreadChannel | PublicThreadChannel
			>;
			if (dp.archived)
				embed.addFields({
					name: 'Archived',
					value: `\`${before.archived}\` => \`${after.archived}\``
				});
			if (dp.autoArchiveDuration)
				embed.addFields({
					name: 'Auto Archive Duration',
					value: `\`${before.autoArchiveDuration}\` => \`${after.autoArchiveDuration}\``
				});
			if (dp.locked)
				embed.addFields({
					name: 'Locked',
					value: `\`${before.locked}\` => \`${after.locked}\``
				});
		}
	}
	if (before instanceof ForumChannel && after instanceof ForumChannel) {
		const dp = differentProperties as Partial<ForumChannel>;
		if (dp.availableTags)
			embed.addFields({
				name: 'Available Tags',
				value: `\`${before.availableTags.join(
					', '
				)}\` => \`${after.availableTags.join(', ')}\``
			});
		if (dp.defaultAutoArchiveDuration)
			embed.addFields({
				name: 'Default Auto Archive Duration',
				value: `\`${before.defaultAutoArchiveDuration}\` => \`${after.defaultAutoArchiveDuration}\``
			});
		if (dp.defaultForumLayout)
			embed.addFields({
				name: 'Default Forum Layout',
				value: `\`${ForumLayoutType[before.defaultForumLayout]}\` => \`${
					ForumLayoutType[after.defaultForumLayout]
				}\``
			});
		if (dp.defaultReactionEmoji)
			embed.addFields({
				name: 'Default Reaction Emoji',
				value: `\`${before.defaultReactionEmoji?.name ?? 'None'}\` => \`${
					after.defaultReactionEmoji?.name ?? 'None'
				}\``
			});
		if (dp.defaultSortOrder)
			embed.addFields({
				name: 'Default Sort Order',
				value: `\`${
					before.defaultSortOrder
						? SortOrderType[before.defaultSortOrder]
						: 'None'
				}\` => \`${
					after.defaultSortOrder
						? SortOrderType[after.defaultSortOrder]
						: 'None'
				}\``
			});
		if (dp.defaultThreadRateLimitPerUser)
			embed.addFields({
				name: 'Default Thread Rate Limit Per User',
				value: `\`${before.defaultThreadRateLimitPerUser ?? 'None'}\` => \`${
					after.defaultThreadRateLimitPerUser ?? 'None'
				}\``
			});
		if (dp.nsfw)
			embed.addFields({
				name: 'NSFW',
				value: `\`${before.nsfw}\` => \`${after.nsfw}\``
			});
		if (dp.rateLimitPerUser)
			embed.addFields({
				name: 'Slowmode Rate Limit',
				value: `\`${before.rateLimitPerUser}\` => \`${after.rateLimitPerUser}\``
			});
		if (dp.topic)
			embed.addFields({
				name: 'Topic',
				value: `\`${after.topic ?? 'None'}\` => \`${before.topic ?? 'None'}\``
			});
	}

	if (differentProperties.permissionsLocked)
		embed.addFields({
			name: 'Permissions Locked With Parent',
			value: `\`${before.permissionsLocked}\` => \`${after.permissionsLocked}\``
		});

	if (differentProperties.permissionOverwrites)
		embed.addFields({
			name: 'Permission Overwrites',
			value: `\`${before.permissionOverwrites.cache.toJSON()}\` => \`${after.permissionOverwrites.cache.toJSON()}\``
		});

	await auditlogChannel.send({
		embeds: [embed]
	});
};

function getDifferentProperties(before: GuildChannel, after: GuildChannel) {
	return Object.entries(after).reduce((diff, [key, value]) => {
		if (before[key as keyof GuildChannel] !== value) {
			// @ts-expect-error Properties are not read-only at creation
			diff[key as keyof GuildChannel] = value;
		}
		return diff;
	}, {} as Partial<GuildChannel>);
}
