import {
	AttachmentBuilder,
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
	inlineCode
} from 'discord.js';
import { Canvas, Image } from '@napi-rs/canvas';
import { dirname, join } from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { isUserData } from '../struct/tetrio/UserData';
import { promises } from 'fs';

export const data = new SlashCommandBuilder()
	.setName('tetrio')
	.setDescription("View a user's stats on TETR.IO")
	.addStringOption((option) => {
		return option
			.setName('username')
			.setDescription('The username of the user to view')
			.setRequired(true);
	});

// ! Make sure to add command to `coghelp.ts`

export async function execute(interaction: ChatInputCommandInteraction) {
	const base = 'https://ch.tetr.io/api';
	const res = await fetch(
		`${base}/users/${interaction.options
			.getString('username', true)
			.toLowerCase()}`,
		{
			headers: {
				'X-Session-ID': 'e74c982e-2445-5042-89c7-198355c9720f'
			}
		}
	);
	const json = await res.json();
	if (!isUserData(json)) {
		await interaction.reply({
			content: 'Internal error: Invalid data received from TETR.IO',
			ephemeral: true
		});
		return;
	}
	if (!json.success || !json.data) {
		await interaction.reply({
			content: `There was an error fetching data for that user: ${inlineCode(
				json.error ?? 'Unknown error'
			)}`,
			ephemeral: true
		});
		return;
	}
	const { data } = json;
	const { user } = data;
	const { gamesplayed, gameswon, league, username } = user;
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
	ctx.font = '200px Ubuntu Mono';
	ctx.lineWidth = 10;
	ctx.fillText(username, canvas.width / 2 - 650, 250);
	ctx.font = '100px Ubuntu Mono';
	ctx.fillText(
		`Rank: ${rank == 'z' ? 'Unranked' : rank.toUpperCase()}`,
		100,
		500
	);
	ctx.fillText(`TR: ${rating == -1 ? 'Unrated' : rating.toFixed(2)}`, 100, 650);
	ctx.fillText(`Games Played: ${gamesplayed}`, 100, 800);
	ctx.fillText(`Games Won: ${gameswon}`, 100, 950);
	await interaction.reply({
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
			new AttachmentBuilder(await canvas.encode('png'), {
				name: `${username}_TETRIO_stats.png`
			})
		]
	});
}
