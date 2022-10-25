import {
	bold,
	italic,
	SlashCommandBuilder,
	spoiler,
	userMention,
} from 'discord.js';
('use strict');
export const data = new SlashCommandBuilder()
	.setName('whoasked')
	.setDescription('Who? ...ASKED')
	.setDMPermission(false)
	.addUserOption((option) => {
		return option
			.setName('user')
			.setDescription('The user who was not asked')
			.setRequired(true);
	});
export const execute = async (interaction, client) => {
	const a = userMention(interaction.user.id),
		b = userMention(interaction.options.getUser('user').id);
	const r = [
		`${b} guess what: ${a} didn't ask.`,
		`${b} guess what: ${a} doesn't remember asking. ...Probably because they didn't.`,
		`${b} guess what: ${bold('WHO? ...ASKED?')} Not ${a}.`,
		`${b} guess what: ${bold('WHO? ...CARES?')} Not ${a}.`,
		`${b} guess what: ${bold(
			`WHAT? ...Makes you think ${a} ${italic('asked')}?`
		)}`,
		`${b} guess what: ${bold(
			`WHAT? ...Makes you think ${a} ${italic('cares')}?`
		)}`,
		`${b} guess what: No one asked you; not even ${a}.`,
		`${b} guess what: No one asked. ${a} didn't ask either.`,
		`${b} guess what: Shut up, because ${a} didn't ask.`,
		`${b} guess what: ${a} did not request your opinion.`,
		`${b} guess what: ${a} did not request your vocalization.`,
		`${b} guess what: ${a} didn't ask. Neither did ${spoiler('UR MOM')}.`,
	];
	await interaction.reply(r[Math.floor(Math.random() * r.length)]);
};
export default {
	data,
	execute,
};
