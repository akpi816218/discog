/* eslint-disable indent */
import {
	APIEmbedField,
	ButtonInteraction,
	EmbedBuilder,
	GuildMember,
	MessageContextMenuCommandInteraction,
	ModalSubmitInteraction,
	PermissionFlagsBits,
	StageChannel,
	StringSelectMenuInteraction,
	UserContextMenuCommandInteraction,
	codeBlock,
	inlineCode,
	time
} from 'discord.js';
import {
	Pronoun,
	PronounCodes,
	areGenderCodes,
	isPronounCode,
	isPronounValue,
	isValidGenderBitField
} from 'pronouns.js';
import Jsoning from 'jsoning';
import { format } from 'prettier';
import { logger } from './logger';

export const InteractionHandlers = {
	// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
	async Button(_interaction: ButtonInteraction) {},
	ContextMenu: {
		async Message(
			interaction: MessageContextMenuCommandInteraction
		): Promise<void> {
			switch (interaction.commandName) {
				case 'Message JSON':
					const json = format(
						JSON.stringify(interaction.targetMessage.toJSON()),
						{
							parser: 'json5',
							tabWidth: 2,
							useTabs: false
						}
					);
					if (json.length > 1990) {
						if (
							!interaction.channel?.isTextBased() ||
							interaction.channel instanceof StageChannel
						)
							return;
						await interaction.reply(
							'JSON is too long, sending in multiple messages...'
						);
						const jsons = json.match(/[\s\S]{1,1990}/g) || [];
						for (const json of jsons) {
							await interaction.channel.send(codeBlock(json));
						}
					} else await interaction.reply(json);
					break;
			}
		},
		async User(interaction: UserContextMenuCommandInteraction): Promise<void> {
			switch (interaction.commandName) {
				case 'User Info':
					const infouser = await interaction.targetUser.fetch(true);
					const mutfields: APIEmbedField[] = [];
					if (interaction.guild && interaction.targetMember) {
						mutfields.push({
							name: 'Server join date',
							value: time(
								// eslint-disable-next-line no-extra-parens
								(interaction.targetMember as GuildMember).joinedAt || undefined
							)
						});
					}
					await interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setColor(infouser.hexAccentColor || null)
								.setTitle(`Who is ${infouser.tag}?`)
								.setThumbnail(infouser.displayAvatarURL())
								.addFields(
									{ name: 'ID:', value: infouser.id },
									{
										name: 'Discord join date:',
										value: time(infouser.createdAt)
									},
									{ name: 'Is bot?', value: infouser.bot.toString() }
								)
								.setTimestamp()
								.setFooter({
									iconURL: interaction.client.user.displayAvatarURL(),
									text: 'Powered by DisCog'
								})
								.addFields(mutfields)
						]
					});
					break;
				case 'User JSON':
					await interaction.reply(
						codeBlock(
							format(JSON.stringify(interaction.targetUser.toJSON()), {
								parser: 'json5',
								tabWidth: 2,
								useTabs: false
							})
						)
					);
			}
		}
	},
	async ModalSubmit(interaction: ModalSubmitInteraction): Promise<void> {
		const db = new Jsoning('botfiles/identity.db.json');
		switch (interaction.customId) {
			case '/global':
				await interaction.reply('Working...');
				const content = interaction.fields.getTextInputValue('/global.text');
				const badGuilds: string[] = [];
				for (const guild of interaction.client.guilds.cache.values()) {
					if (
						!guild.systemChannel ||
						!guild.systemChannel
							.permissionsFor(
								guild.members.cache.get(
									interaction.client.user.id
								) as GuildMember
							)
							.has(PermissionFlagsBits.SendMessages)
					) {
						badGuilds.push(guild.name);
						guild
							.fetchOwner()
							.then((member) => member.createDM())
							.then((dm) =>
								dm.send({
									embeds: [
										new EmbedBuilder()
											.setTitle('DisCog Global System Announcement')
											.setDescription(
												`You are receiving this message because you are the owner of a guild which I am part of, and I have an important system message to deliver to your guild. However, your guild either does not have a system channel, or I do not have the necessary permissions to send the message. Because of this, I could not post the announcement. You can set a system channel by going to Server Settings > Overview > System Messages Channel and change channel permissions by right-clicking or long pressing (mobile) the system channel, selecting Edit Channel, and going to the Permissions category. In the meantime, please use my ${inlineCode(
													'/announce'
												)} command to deliver the following message to your guild.`
											)
											.setFields(
												{ name: 'Guild Name', value: guild.name },
												{ name: 'Message', value: content }
											)
									]
								})
							);
						return;
					}
					try {
						guild.systemChannel.send({
							// Remove @everyone ping: does content need to have a value?
							// eslint-disable-next-line capitalized-comments
							// content: '',
							embeds: [
								new EmbedBuilder()
									.setTitle('DisCog Global System Announcement')
									.setDescription(content)
									.setTimestamp()
									.setFooter({
										iconURL: interaction.user.displayAvatarURL(),
										text: `Sent by ${interaction.user.tag}`
									})
							]
						});
					} catch (e) {
						badGuilds.push(guild.name);
						guild
							.fetchOwner()
							.then((member) => member.createDM())
							.then((dm) =>
								dm.send({
									embeds: [
										new EmbedBuilder()
											.setTitle('DisCog Global System Announcement')
											.setDescription(
												`You are receiving this message because you are the owner of a guild which I am part of, and I have an important system message to deliver to your guild. However, your guild does not have a system channel, so I could not post the announcement. You can set a system channel by going to Server Settings > Overview > System Messages Channel. In the meantime, please use my ${inlineCode(
													'/announce'
												)} command to deliver the following message to your guild.`
											)
											.setFields(
												{ name: 'Guild Name', value: guild.name },
												{ name: 'Message', value: content }
											)
									]
								})
							);
						logger.error(e);
					}
				}
				await interaction.editReply(
					`Done. ${
						badGuilds.length > 0
							? `The following guilds did not receive the announcement: ${badGuilds.join(
									', '
							  )}`
							: 'All guilds received the announcement.'
					}`
				);
				break;
			case '/identity_pronouns_set_custom':
				const choice = `CustomPronoun:${interaction.fields.getTextInputValue(
					'/pronouns_modal_text'
				)}`;
				if (!isPronounValue(choice)) {
					await interaction.reply('Error: Invalid formatting');
					return;
				}
				const pn = new Pronoun(PronounCodes.other, choice);
				const currentpn = db.get(interaction.user.id) || {
					bio: null,
					gender: null,
					name: null,
					pronouns: null
				};
				currentpn.pronouns = pn;
				await db.set(interaction.user.id, currentpn);
				await interaction.reply({
					content: `User pronouns set: ${pn.toString()}`,
					ephemeral: true
				});
				break;
			case '/identity_bio_set':
				const bio = interaction.fields.getTextInputValue(
					'/identity_bio_set_text'
				);
				const currentbio = db.get(interaction.user.id) || {
					bio: '',
					gender: null,
					name: '',
					pronouns: null
				};
				currentbio.bio = bio;
				await db.set(interaction.user.id, currentbio);
				await interaction.reply({ content: 'Bio set', ephemeral: true });
		}
	},
	async StringSelectMenu(
		interaction: StringSelectMenuInteraction
	): Promise<void> {
		const db = new Jsoning('botfiles/identity.db.json');
		switch (interaction.customId) {
			case '/identity_pronouns_set_select':
				const choice = interaction.values[0];
				if (!isPronounCode(choice)) {
					await interaction.reply({
						content: 'Error: Invalid formatting',
						ephemeral: true
					});
					return;
				}
				const pn = new Pronoun(choice);
				const currentpn = db.get(interaction.user.id) || {
					bio: null,
					gender: null,
					name: null,
					pronouns: null
				};
				currentpn.pronouns = pn.toJSON();
				await db.set(interaction.user.id, currentpn);
				const doneMsg = await interaction.reply({
					content: `User pronouns set: ${pn.value}`,
					fetchReply: true
				});
				setTimeout(() => doneMsg.delete(), 5_000);
				break;
			case '/identity_gender_set_select':
				const selected = interaction.values;
				if (!areGenderCodes(selected)) throw new Error('Invalid Gender Codes');
				if (!isValidGenderBitField(selected)) {
					await interaction.reply({
						content: 'Error: Invalid choices',
						ephemeral: true
					});
					return;
				}
				const igssdata = db.get(interaction.user.id) || {
					bio: null,
					gender: null,
					name: null,
					pronouns: null
				};
				igssdata.gender = selected;
				await db.set(interaction.user.id, igssdata);
				await interaction.reply({
					content: 'Done.',
					ephemeral: true
				});
				break;
		}
	}
};
