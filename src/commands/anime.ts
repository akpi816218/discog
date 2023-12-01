import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
	hyperlink
} from 'discord.js';
import { NbCategories, Client as NekosBestClient } from 'nekos-best.js';
import _ from 'lodash';
import { CommandHelpEntry } from '../struct/CommandHelpEntry';
const { capitalize } = _;

const GIF_CATEGORIES = [
		'baka',
		// 'bite',
		'blush',
		'bored',
		'cry',
		'cuddle',
		// 'dance',
		'facepalm',
		// 'feed',
		'happy',
		'highfive',
		'hug',
		'kiss',
		'laugh',
		// 'pat',
		// 'pout',
		'shrug',
		'slap',
		'sleep',
		'smile',
		// 'smug',
		// 'stare',
		'think',
		'thumbsup',
		'tickle',
		'wave',
		'wink',
		// 'kick',
		// 'handhold',
		// 'punch',
		// 'shoot',
		'yeet',
		// 'poke',
		'nod',
		'nom',
		'nope',
		// 'handshake',
		// 'lurk',
		// 'peck',
		'yawn'
	],
	IMAGE_CATEGORIES = ['kitsune', 'neko', 'husbando', 'waifu'],
	nekosBestClient = new NekosBestClient();

export const help = new CommandHelpEntry(
	'anime',
	'Get an anime image or GIF from nekos.best',
	[
		'image <category: string> [count: 1 <= number <= 5 || 1]',
		'gif <category: string> [count: 1 <= number <= 5 || 1]'
	]
);

export const data = new SlashCommandBuilder()
	.setName('anime')
	.setDescription('Get an anime image or GIF from nekos.best')
	.addSubcommand(subcommand => {
		return subcommand
			.setName('image')
			.setDescription('Get an anime image from nekos.best')
			.addStringOption(option => {
				return option
					.setName('category')
					.setDescription('The category of image to get')
					.setRequired(true)
					.addChoices(
						...IMAGE_CATEGORIES.map(category => {
							return { name: capitalize(category), value: category };
						})
					);
			});
	})
	.addSubcommand(subcommand => {
		return subcommand
			.setName('gif')
			.setDescription('Get an anime GIF from nekos.best')
			.addStringOption(option => {
				return option
					.setName('category')
					.setDescription('The category of GIF to get')
					.setRequired(true)
					.addChoices(
						...GIF_CATEGORIES.map(category => {
							return { name: capitalize(category), value: category };
						})
					);
			})
			.addIntegerOption(option => {
				return option
					.setName('count')
					.setDescription('The number of GIFs to get')
					.setRequired(true)
					.setMinValue(1)
					.setMaxValue(5);
			});
	})
	.setDMPermission(true);

export const execute = async (interaction: ChatInputCommandInteraction) => {
	const count = interaction.options.getInteger('count'),
		mainCategory = interaction.options.getString('category');
	if (!mainCategory) {
		await interaction.reply({
			content: 'Please select a category',
			ephemeral: true
		});
		return;
	}
	await interaction.deferReply();
	const { results } = await nekosBestClient.fetch(
		mainCategory as NbCategories,
		count ?? 1
	);
	const embeds: EmbedBuilder[] = [];
	for (const result of results)
		embeds.push(
			new EmbedBuilder()
				.setTitle(`Anime | ${mainCategory}`)
				.setDescription(
					`${hyperlink(
						'nekos.best Terms and Conditions',
						'https://docs.nekos.best/legal/terms.html'
					)}\n${hyperlink(
						'nekos.best Privacy Policy',
						'https://docs.nekos.best/legal/privacy.html'
					)}`
				)
				.setImage(result.url)
				.setFields(
					{
						name: 'Artist',
						value:
							result.artist_name && result.artist_href
								? hyperlink(result.artist_name, result.artist_href)
								: result.artist_name ?? 'Unknown'
					},
					{
						name: 'Source',
						value: result.source_url ?? 'Unknown'
					}
				)
				.setFooter({
					iconURL: interaction.client.user.displayAvatarURL(),
					text: 'Powered by DisCog and nekos.best'
				})
		);

	await interaction.editReply({
		embeds: embeds
	});
};
