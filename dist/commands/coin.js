/* eslint-disable indent */
import {
	EmbedBuilder,
	SlashCommandBuilder,
	inlineCode,
	userMention
} from 'discord.js';
import Jsoning from 'jsoning';
const db = new Jsoning('botfiles/coin.db.json');
export const data = new SlashCommandBuilder()
	.setName('coin')
	.setDescription('Currency commands')
	.setDMPermission(true)
	.addSubcommand((subcommand) => {
		return subcommand.setName('mine').setDescription('Mine for coins');
	})
	.addSubcommand((subcommand) => {
		return subcommand
			.setName('gamble')
			.setDescription('Play rock paper scissors')
			.addIntegerOption((option) => {
				return option
					.setName('amount')
					.setDescription('The amount to gamble')
					.setRequired(true);
			});
	})
	.addSubcommand((subcommand) => {
		return (
			subcommand
				.setName('show')
				// eslint-disable-next-line quotes
				.setDescription("Look at someone's bank account")
				.addUserOption((option) => {
					return option
						.setName('user')
						.setDescription('The user to peek at')
						.setRequired(false);
				})
		);
	})
	.addSubcommand((subcommand) => {
		return subcommand
			.setName('leaderboard')
			.setDescription('Show the top 5 rich kids');
	});
export const execute = async (interaction) => {
	switch (interaction.options.getSubcommand(false)) {
		case 'mine':
			let mcoins;
			if (!db.get(interaction.user.id.toString())) mcoins = 0;
			else mcoins = db.get(interaction.user.id.toString()).coins;
			const add = 9 + Math.ceil(Math.random() * 5);
			mcoins += add;
			await db.set(interaction.user.id.toString(), {
				coins: mcoins,
				tag: interaction.user.tag
			});
			await interaction.reply(
				`${userMention(
					interaction.user.id
				)} dug up ${add} coins and now has ${mcoins}.`
			);
			break;
		case 'gamble':
			await interaction.reply(
				'This feature is still in development! Check back soon!'
			);
			break;
		case 'show':
			const user = interaction.options.getUser('user');
			if (!user) {
				let uacoins = db.get(interaction.user.id.toString()).coins;
				if (uacoins === null) uacoins = 0;
				await interaction.reply(`You have ${uacoins} coins.`);
			} else {
				let ubcoins = db.get(user.id.toString()).coins;
				if (ubcoins === null) ubcoins = 0;
				await interaction.reply(
					`${userMention(user.id)} has ${ubcoins} coins.`
				);
			}
			break;
		case 'leaderboard':
			const all = db.all();
			const arr = [];
			for (const prop in all) arr.push([prop, all[prop]]);
			arr.sort((a, b) => b[1].coins - a[1].coins);
			const embed = new EmbedBuilder()
				.setTitle('DisCog Currency Leaderboard')
				.setDescription(
					`This leaderboard might be outdated. Run ${inlineCode(
						'/coin leaderboard'
					)} to get a new one.`
				)
				.setTimestamp();
			const fields = [];
			arr.forEach((val) => {
				fields.push({
					name: val[1].tag.toString(),
					value: val[1].coins.toString()
				});
			});
			embed.addFields(...fields);
			await interaction.reply({ embeds: [embed] });
			break;
		default:
		case null:
			await interaction.reply({
				content: 'That is not a valid command.',
				ephemeral: true
			});
	}
};
export default {
	data,
	execute
};
