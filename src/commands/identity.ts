/* eslint-disable indent */
import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	EmbedBuilder,
	ModalBuilder,
	SlashCommandBuilder,
	StringSelectMenuBuilder,
	TextInputBuilder,
	TextInputStyle,
	userMention
} from 'discord.js';
import {
	DefaultPronouns,
	Gender,
	GenderCodes,
	Pronoun,
	isGenderObject,
	isPronounObject
} from 'pronouns.js';
import Jsoning from 'jsoning';

export const data = new SlashCommandBuilder()
	.setName('identity')
	.setDescription('Create or view an identity profile')
	.addSubcommandGroup((group) => {
		return group
			.setName('name')
			.setDescription("Set your or view another's name")
			.addSubcommand((subcommand) => {
				return subcommand
					.setName('set')
					.setDescription('Set your name')
					.addStringOption((option) => {
						return option
							.setName('name')
							.setDescription('Your name')
							.setRequired(true)
							.setMaxLength(32);
					});
			})
			.addSubcommand((subcommand) => {
				return subcommand
					.setName('view')
					.setDescription("View a user's name")
					.addUserOption((option) => {
						return option
							.setName('user')
							.setDescription('The target user')
							.setRequired(false);
					});
			});
	})
	.addSubcommandGroup((group) => {
		return group
			.setName('pronouns')
			.setDescription('Set or view your pronouns')
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
			});
	})
	.addSubcommandGroup((group) => {
		return group
			.setName('bio')
			.setDescription('Set or view your bio')
			.addSubcommand((subcommand) => {
				return subcommand.setName('set').setDescription('Set your bio');
			})
			.addSubcommand((subcommand) => {
				return subcommand
					.setName('view')
					.setDescription("View a user's bio")
					.addUserOption((option) => {
						return option
							.setName('user')
							.setDescription('The target user')
							.setRequired(false);
					});
			});
	})
	.addSubcommandGroup((group) => {
		return group
			.setName('gender')
			.setDescription('Set or view gender')
			.addSubcommand((subcommand) => {
				return subcommand.setName('set').setDescription('Set your gender');
			})
			.addSubcommand((subcommand) => {
				return subcommand
					.setName('view')
					.setDescription("View someone's gender")
					.addUserOption((option) => {
						return option
							.setName('user')
							.setDescription('The target user')
							.setRequired(false);
					});
			});
	})
	.addSubcommand((subcommand) => {
		return subcommand
			.setName('view')
			.setDescription("View a user's identity")
			.addUserOption((option) => {
				return option
					.setName('user')
					.setDescription('The target user')
					.setRequired(false);
			});
	})
	.setDMPermission(false);

export const execute = async (interaction: ChatInputCommandInteraction) => {
	const baseEmbed = new EmbedBuilder()
		.setTimestamp()
		.setFooter({
			iconURL: interaction.client.user.displayAvatarURL(),
			text: 'Powered by DisCog'
		})
		.setColor('Random');
	const db = new Jsoning('botfiles/identity.db.json');
	const subcommandgroup = interaction.options.getSubcommandGroup();
	if (!subcommandgroup && interaction.options.getSubcommand() == 'view') {
		const user = interaction.options.getUser('user') || interaction.user;
		if (!db.has(user.id)) {
			await interaction.reply({
				embeds: [
					baseEmbed
						.setTitle('Identity | Complete Profile')
						.setThumbnail(user.displayAvatarURL())
						.setDescription(
							`${userMention(user.id)} has not created an identity profile yet.`
						)
				]
			});
			return;
		}
		const data = db.get(user.id);
		const embed = baseEmbed
			.setTitle('Identity | Complete Profile')
			.addFields({
				name: 'User',
				value: `${userMention(user.id)} ${user.tag}`
			})
			.setThumbnail(user.displayAvatarURL());
		if (data.name) embed.addFields({ name: 'Name', value: data.name });
		if (data.bio) embed.addFields({ name: 'Bio', value: data.bio });
		if (isPronounObject(data.pronouns))
			embed.addFields({
				name: 'Pronouns',
				value: Pronoun.fromJSON(data.pronouns).toString()
			});
		if (isGenderObject(data.gender))
			embed.addFields({
				name: 'Gender',
				value: Gender.fromJSON(data.gender).bits.join(', ')
			});
		if (data.orientation)
			embed.addFields({ name: 'Orientation', value: data.orientation });
		await interaction.reply({ embeds: [embed] });
		return;
	}
	const subcommand = interaction.options.getSubcommand();
	switch (subcommandgroup) {
		case 'name':
			if (subcommand == 'set') {
				const name = interaction.options.getString('name');
				if (!name) {
					await interaction.reply({
						content: 'Please provide a name.',
						ephemeral: true
					});
					return;
				}
				const ndata = db.get(interaction.user.id) || {
					bio: null,
					gender: null,
					name: null,
					pronouns: null
				};
				Object.defineProperty(ndata, 'name', name);
				db.set(interaction.user.id, ndata);
				await interaction.reply({
					content: `Successfully set your name to ${name}.`,
					ephemeral: true
				});
				return;
			} else if (subcommand == 'view') {
				const user = interaction.options.getUser('user') || interaction.user;
				const ndata = db.get(user.id) || {
					bio: null,
					gender: null,
					name: null,
					pronouns: null
				};
				if (!ndata.name) {
					await interaction.reply({
						embeds: [
							baseEmbed
								.setTitle('Identity | Name')
								.setDescription(
									`${userMention(user.id)} has not set their name yet.`
								)
								.setThumbnail(user.displayAvatarURL())
						]
					});
					return;
				} else {
					await interaction.reply({
						embeds: [
							baseEmbed
								.setTitle('Identity | Name')
								.setDescription(ndata.name)
								.setThumbnail(user.displayAvatarURL())
						]
					});
					return;
				}
			}
			break;
		case 'bio':
			if (subcommand == 'set') {
				await interaction.showModal(
					new ModalBuilder()
						.setCustomId('/identity_bio_set')
						.setTitle('Set User Bio')
						.setComponents(
							new ActionRowBuilder<TextInputBuilder>().setComponents(
								new TextInputBuilder()
									.setCustomId('/identity_bio_set_text')
									.setPlaceholder('Enter your bio here')
									.setStyle(TextInputStyle.Paragraph)
									.setMaxLength(250)
									.setRequired(true)
									.setLabel('Bio')
							)
						)
				);
				return;
			} else if (subcommand == 'view') {
				const user = interaction.options.getUser('user') || interaction.user;
				const biodata = (
					db.get(user.id) || {
						bio: null,
						gender: null,
						name: null,
						pronouns: null
					}
				).bio;
				if (!biodata) {
					await interaction.reply({
						embeds: [
							baseEmbed
								.setTitle('Identity | Bio')
								.setDescription(
									`${userMention(user.id)} (${
										user.tag
									}) has not set their bio yet.`
								)
								.setThumbnail(user.displayAvatarURL())
						]
					});
					return;
				} else {
					await interaction.reply({
						embeds: [
							baseEmbed.setTitle('Identity | Bio').addFields(
								{
									name: 'User',
									value: `${userMention(user.id)} ${user.tag}`
								},
								{
									name: 'Bio',
									value: biodata
								}
							)
						]
					});
				}
			}
			break;
		case 'pronouns':
			if (subcommand == 'set') {
				if (!interaction.options.getBoolean('custom')) {
					await interaction.reply({
						components: [
							new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
								new StringSelectMenuBuilder()
									.setMaxValues(1)
									.setMinValues(1)
									.setCustomId('/identity_pronouns_set_select')
									.setOptions(
										{
											label: DefaultPronouns.any.toString(),
											value: DefaultPronouns.any.toString()
										},
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
							.setCustomId('/identity_pronouns_set_custom')
							.setComponents(
								new ActionRowBuilder<TextInputBuilder>().setComponents(
									new TextInputBuilder()
										.setCustomId('/pronouns_modal_text')
										.setLabel('Custom Pronouns')
										.setStyle(TextInputStyle.Short)
										.setPlaceholder('Ex: It/It/Zir or Any')
										.setRequired(true)
								)
							)
					);
				}
			} else if (subcommand == 'view') {
				const user = interaction.options.getUser('user') || interaction.user;

				const pndata = (
					db.get(user.id) || {
						bio: null,
						gender: null,
						name: null,
						pronouns: null
					}
				).pronouns;
				if (!pndata || !isPronounObject(pndata)) {
					await interaction.reply({
						embeds: [
							baseEmbed
								.setTitle('Identity | Pronouns')
								.setDescription(
									`${userMention(user.id)} (${
										user.tag
									}) has not set their pronouns yet.`
								)
								.setThumbnail(user.displayAvatarURL())
								.setFooter({
									iconURL: interaction.client.user.displayAvatarURL(),
									text: 'Powered by DisCog'
								})
						]
					});
					return;
				}
				const pn = Pronoun.fromJSON(pndata);
				await interaction.reply({
					embeds: [
						baseEmbed.setTitle('Identity | Pronouns').addFields(
							{
								name: 'User',
								value: `${userMention(user.id)} (${user.tag})`
							},
							{
								name: 'Pronouns',
								value: pn.toString()
							}
						)
					]
				});
			}
			break;
		case 'gender':
			if (interaction.options.getSubcommand() == 'set')
				await interaction.reply({
					components: [
						new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
							new StringSelectMenuBuilder()
								.setCustomId('/identity_gender_set_select')
								.setOptions(
									{
										label: 'AMAB',
										value: GenderCodes.amab
									},
									{
										label: 'AFAB',
										value: GenderCodes.afab
									},
									{
										label: 'Male',
										value: GenderCodes.male
									},
									{
										label: 'Female',
										value: GenderCodes.female
									},
									{
										label: 'Nonbinary',
										value: GenderCodes.nonbinary
									},
									{
										label: 'Agender',
										value: GenderCodes.agender
									},
									{
										label: 'Demigender',
										value: GenderCodes.demigender
									},
									{
										label: 'Genderfluid',
										value: GenderCodes.genderfluid
									},
									{
										label: 'Polygender',
										value: GenderCodes.polygender
									},
									{
										label: 'Cisgender',
										value: GenderCodes.cisgender
									},
									{
										label: 'Transgender',
										value: GenderCodes.transgender
									},
									{
										label: 'Genderqueer',
										value: GenderCodes.queer
									},
									{
										label: 'Other',
										value: GenderCodes.other
									}
								)
								.setMaxValues(Object.entries(GenderCodes).length)
						)
					],
					content: `Select your gender identities below`,
					ephemeral: true
				});
			else if (interaction.options.getSubcommand() == 'view') {
				const user = interaction.options.getUser('user') || interaction.user;
				const data = db.get(user.id) || {
					bio: null,
					gender: null,
					name: null,
					pronouns: null
				};
				const genderdata = data.gender;
				if (!genderdata) {
					await interaction.reply(
						`${userMention(user.id)} (${
							user.tag
						}) has not set their gender yet.`
					);
					return;
				}
				if (!isGenderObject(genderdata)) {
					await interaction.reply(
						`${userMention} (${user.tag})'s data has become corrupted. Please have them reset it.`
					);
					return;
				}
				const gender = Gender.fromJSON(genderdata);
				await interaction.reply({
					embeds: [
						baseEmbed
							.setTitle('Identity | Gender')
							.setThumbnail(user.displayAvatarURL())
							.setColor('Random')
							.addFields(
								{
									name: 'User',
									value: `${userMention(interaction.user.id)} (${
										interaction.user.tag
									})`
								},
								{
									name: 'AFAB',
									value: gender.afab.toString()
								},
								{
									name: 'AMAB',
									value: gender.amab.toString()
								},
								{
									name: 'Male',
									value: gender.male.toString()
								},
								{
									name: 'Female',
									value: gender.female.toString()
								},
								{
									name: 'Cisgender',
									value: gender.cisgender.toString()
								},
								{
									name: 'Transgender',
									value: gender.transgender.toString()
								},
								{
									name: 'Agender',
									value: gender.agender.toString()
								},
								{
									name: 'Demigender',
									value: gender.demigender.toString()
								},
								{
									name: 'Nonbinary',
									value: gender.nonbinary.toString()
								},
								{
									name: 'Genderfluid',
									value: gender.genderfluid.toString()
								},
								{
									name: 'Polygender',
									value: gender.polygender.toString()
								},
								{
									name: 'Genderqueer',
									value: gender.queer.toString()
								}
							)
					]
				});
			}
			break;
	}
};

export default {
	data,
	execute
};
