/* eslint-disable indent */
import {
	AttachmentBuilder,
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
	inlineCode
} from 'discord.js';
import { Canvas, Image } from '@napi-rs/canvas';
import { UserData, isUserData } from '../struct/tetrio/UserData';
import { dirname, join } from 'path';
import { getUser, userFromDiscord } from '../struct/tetrio/getUser';
import { fileURLToPath } from 'url';
import { promises } from 'fs';

export const data = new SlashCommandBuilder()
	.setName('tetrio')
	.setDescription("View a user's stats on TETR.IO")
	.addSubcommand((subcommand) => {
		return subcommand
			.setName('view')
			.setDescription("View a user's stats on TETR.IO by username")
			.addStringOption((option) => {
				return option
					.setName('username')
					.setDescription('The username of the user to view')
					.setRequired(true);
			});
	})
	.addSubcommand((subcommand) => {
		return subcommand
			.setName('discord')
			.setDescription("View a user's stats on TETR.IO by Discord ID")
			.addUserOption((option) => {
				return option
					.setName('user')
					.setDescription('The user to view')
					.setRequired(true);
			});
	});

async function getStatsImage(json: UserData): Promise<Buffer> {
	if (!json.data) throw new Error(json.error ?? 'Unknown error');
	const { gamesplayed, gameswon, league, username } = json.data.user;
	const { rank, rating } = league;
	const canvas = new Canvas(1920, 1080);
	const ctx = canvas.getContext('2d');
	const background = new Image();
	background.src = await promises.readFile(
		join(
			dirname(fileURLToPath(import.meta.url)),
			'../../botfiles/tetrio-coverart-alt.png'
		)
	);
	ctx.drawImage(background, 0, 0);
	ctx.fillStyle = 'white';
	// If 'Ubuntu Mono' is not installed, the resulting image will not use a monospace font.
	// Install the font from https://design.ubuntu.com/font/ or use 'Noto Sans Mono' instead.
	ctx.font = '200px Ubuntu Mono';
	ctx.lineWidth = 10;
	ctx.fillText(username, canvas.width / 2 - 650, 250);
	ctx.font = '100px Noto Sans Mono';
	ctx.fillText(
		`Rank: ${rank == 'z' ? 'Unranked' : rank.toUpperCase()}`,
		100,
		500
	);
	ctx.fillText(`TR: ${rating == -1 ? 'Unrated' : rating.toFixed(2)}`, 100, 650);
	ctx.fillText(`Games Played: ${gamesplayed}`, 100, 800);
	ctx.fillText(`Games Won: ${gameswon}`, 100, 950);
	return await canvas.encode('png');
}

export async function execute(interaction: ChatInputCommandInteraction) {
	await interaction.deferReply();
	const XSessionID = 'e74c982e-2445-5042-89c7-198355c9720f';
	let data: UserData | null = null;
	switch (interaction.options.getSubcommand()) {
		case 'discord':
			data = await userFromDiscord(
				interaction.options.getUser('user', true).id,
				XSessionID
			).catch(() => null);
			break;
		case 'view':
			data = await getUser(
				interaction.options.getString('username', true),
				XSessionID
			);
			break;
	}
	// eslint-disable-next-line no-console
	if (data === null) {
		await interaction.editReply(
			'There is no TETR.IO account linked to that Discord user.'
		);
		return;
	}
	if (!isUserData(data)) {
		await interaction.editReply(
			'Internal error: Invalid data received from TETR.IO'
		);
		return;
	}
	if (!data.success || !data.data) {
		await interaction.editReply(
			`There was an error fetching data for that user: ${inlineCode(
				data.error ?? 'Unknown error'
			)}`
		);
		return;
	}
	const { username } = data.data.user;
	await interaction.editReply({
		embeds: [
			new EmbedBuilder()
				.setTitle(`${username}'s stats on TETR.IO`)
				.setDescription('Note: We are not affiliated in any way with TETR.IO.')
				.setImage(`attachment://${username}_TETRIO_stats.png`)
				.setFooter({
					iconURL: interaction.client.user.displayAvatarURL(),
					text: 'Powered by DisCog'
				})
		],
		files: [
			new AttachmentBuilder(await getStatsImage(data), {
				name: `${username}_TETRIO_stats.png`
			})
		]
	});
}
