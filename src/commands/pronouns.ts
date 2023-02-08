import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	EmbedBuilder,
	ModalBuilder,
	SlashCommandBuilder,
	StringSelectMenuBuilder,
	TextInputBuilder,
	TextInputStyle,
	inlineCode,
	userMention
} from 'discord.js';
import {
	DefaultPronouns,
	Pronoun,
	isPronounObject
} from '../struct/Pronouns.js';
import Jsoning from 'jsoning';

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
		return (
			subcommand
				.setName('view')
				// eslint-disable-next-line quotes
				.setDescription("View a user's pronouns")
				.addUserOption((option) => {
					return option.setName('user').setDescription('The target user');
				})
		);
	})
	.setDMPermission(false);

export const execute = async (interaction: ChatInputCommandInteraction) => {
	const db = new Jsoning('pronouns.db.json');
	const subcommand = interaction.options.getSubcommand();
	if (subcommand == 'set') {
		if (!interaction.options.getBoolean('custom')) {
			await interaction.reply({
				components: [
					new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
						new StringSelectMenuBuilder()
							.setMaxValues(1)
							.setMinValues(1)
							.setCustomId('/pronouns_select')
							.setOptions(
								{
									label: DefaultPronouns.theyThem.toString(),
									value: DefaultPronouns.theyThem.toString()
								},
								{
									label: DefaultPronouns.heHim.toString(),
									value: DefaultPronouns.heHim.toString()
								},
								{
									label: DefaultPronouns.sheHer.toString(),
									value: DefaultPronouns.sheHer.toString()
								},
								{
									label: DefaultPronouns.other.toString(),
									value: DefaultPronouns.other.toString()
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
						new ActionRowBuilder<TextInputBuilder>().setComponents(
							new TextInputBuilder()
								.setCustomId('/pronouns_modal_text')
								.setLabel('Custom Pronouns')
								.setStyle(TextInputStyle.Short)
								.setPlaceholder('It/It')
								.setRequired(true)
						)
					)
			);
		}
	} else if (subcommand == 'view') {
		const user = interaction.options.getUser('user') || interaction.user;
		const data = db.get(user.id) || {};
		if (!data || !isPronounObject(data)) {
			await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle('User Pronouns')
						.setDescription(
							`${userMention(user.id)} (${
								user.tag
							}) has not set their pronouns, or their data has become corrupted. Ask them to use ${inlineCode(
								'/pronouns set'
							)} to set their pronouns.`
						)
						.setFooter({
							iconURL: interaction.client.user.displayAvatarURL(),
							text: 'Powered by DisCog'
						})
				]
			});
			return;
		}
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
						iconURL: interaction.client.user.displayAvatarURL(),
						text: 'Powered by DisCog'
					})
			]
		});
	}
};
export default {
	data,
	execute
};
