import {
	ActionRowBuilder,
	EmbedBuilder,
	ModalBuilder,
	SlashCommandBuilder,
	StringSelectMenuBuilder,
	TextInputBuilder,
	TextInputStyle,
	userMention
} from 'discord.js';
import Jsoning from 'jsoning';
import {
	DefaultPronouns,
	Pronoun,
	isPronounObject
} from '../struct/Pronouns.js';
('use strict');
export const data = new SlashCommandBuilder()
	.setName('pronouns')
	.setDescription('Pronoun viewing and management')
	.addSubcommand((subcommand) => {
		return subcommand
			.setName('set')
			.setDescription('Set your pronouns')
			.addBooleanOption((option) => {
				return option
					.setName('custom')
					.setDescription('Create custom pronouns?')
					.setRequired(false);
			});
	})
	.addSubcommand((subcommand) => {
		return subcommand
			.setName('view')
			.setDescription("View a user's pronouns")
			.addUserOption((option) => {
				return option.setName('user').setDescription('The target user');
			});
	})
	.setDMPermission(false);
export const execute = async (interaction) => {
	const db = new Jsoning('pronouns.db.json');
	const subcommand = interaction.options.getSubcommand();
	if (subcommand == 'set') {
		if (!interaction.options.getBoolean('custom')) {
			await interaction.reply({
				components: [
					new ActionRowBuilder().setComponents(
						new StringSelectMenuBuilder()
							.setMaxValues(1)
							.setMinValues(1)
							.setCustomId('/pronouns_select')
							.setOptions(
								{
									label: DefaultPronouns.theyThem.toString(),
									value: DefaultPronouns.theyThem.code.toString()
								},
								{
									label: DefaultPronouns.heHim.toString(),
									value: DefaultPronouns.heHim.code.toString()
								},
								{
									label: DefaultPronouns.sheHer.toString(),
									value: DefaultPronouns.sheHer.code.toString()
								},
								{
									label: DefaultPronouns.other.toString(),
									value: DefaultPronouns.other.code.toString()
								}
							)
					)
				],
				content: 'Select your pronouns below',
				ephemeral: true
			});
		} else {
			await interaction.showModal(
				new ModalBuilder()
					.setTitle('Set Custom User Pronouns')
					.setCustomId('/pronouns_modal')
					.setComponents(
						new ActionRowBuilder().setComponents(
							new TextInputBuilder()
								.setCustomId('/pronouns_modal_text')
								.setLabel('Custom Pronouns')
								.setStyle(TextInputStyle.Short)
								.setPlaceholder(
									'Your custom pronouns. Format them properly (i.e. "They/Them")'
								)
								.setRequired(true)
						)
					)
			);
		}
	} else if (subcommand == 'view') {
		const user = interaction.options.getUser('user');
		if (!user) throw new Error('No user specified');
		const data = db.get(user.id);
		if (!isPronounObject(data)) throw new Error('User data is corrupted');
		const pn = Pronoun.fromJSON(data);
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle('User Pronouns')
					.addFields(
						{ name: 'User', value: `${userMention(user.id)} (${user.tag})` },
						{
							name: 'Pronouns',
							value: pn.toString()
						}
					)
					.setFooter({
						text: 'Powered by DisCog',
						iconURL: interaction.client.user.displayAvatarURL()
					})
			]
		});
	}
};
export default {
	data,
	execute
};
