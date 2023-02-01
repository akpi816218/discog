import { SlashCommandBuilder, bold, userMention } from 'discord.js';
import Jsoning from 'jsoning';
const db = new Jsoning('main.db.json');
export const data = new SlashCommandBuilder()
	.setName('count')
	.setDescription('Increase the count!')
	.setDMPermission(true);
export async function execute(interaction) {
	let count = parseInt(db.get('count'));
	count++;
	db.set('count', count);
	await interaction.reply(
		`${userMention(interaction.user.id)} counted to ${bold(count.toString())}!`
	);
}
export default {
	data,
	execute
};
