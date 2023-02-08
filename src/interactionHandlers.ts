/* eslint-disable indent */
import {
	APIEmbedField,
	ButtonInteraction,
	EmbedBuilder,
	GuildMember,
	MessageContextMenuCommandInteraction,
	ModalSubmitInteraction,
	SelectMenuInteraction,
	UserContextMenuCommandInteraction,
	codeBlock,
	inlineCode,
	time
} from 'discord.js';
import { Pronoun, PronounCodes, isPronounValue } from './struct/Pronouns.js';
import Jsoning from 'jsoning';
import { format } from 'prettier';

export const InteractionHandlers = {
	// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
	async Button(_interaction: ButtonInteraction) {},
	ContextMenu: {
		async Message(interaction: MessageContextMenuCommandInteraction) {
			switch (interaction.commandName) {
				case 'JSON':
					await interaction.reply(
						codeBlock(
							format(JSON.stringify(interaction.targetMessage.toJSON()), {
								parser: 'json5',
								tabWidth: 2,
								useTabs: false
							})
						)
					);
					break;
			}
		},
		async User(interaction: UserContextMenuCommandInteraction) {
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
				case 'JSON':
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
	async ModalSubmit(interaction: ModalSubmitInteraction) {
		switch (interaction.customId) {
			case '/global':
				interaction.reply('Working...');
				const content = interaction.fields.getTextInputValue('/global.text');
				const badGuilds: string[] = [];
				interaction.client.guilds.cache.forEach((guild) => {
					if (!guild.systemChannel) {
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
						return;
					}
					guild.systemChannel.send({
						content: '@everyone',
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
				});
				interaction.editReply(
					`Done. ${
						badGuilds.length > 0
							? `The following guilds did not receive the announcement: ${badGuilds.join(
									', '
							  )}`
							: 'All guilds received the announcement.'
					}`
				);
				break;
			case '/pronouns_modal':
				const choice = `CustomPronoun:${interaction.fields.getTextInputValue(
					'/pronouns_modal_text'
				)}`;
				if (!isPronounValue(choice)) {
					await interaction.reply('Error: Invalid formatting');
					return;
				}
				const pn = new Pronoun(PronounCodes.other, choice);
				const db = new Jsoning('botfiles/pronouns.db.json');
				await db.set(interaction.user.id, pn.toJSON());
				await interaction.reply({
					content: `User pronouns set: ${pn.value}`,
					ephemeral: true
				});
				break;
		}
	},
	async StringSelectMenu(interaction: SelectMenuInteraction) {
		switch (interaction.customId) {
			case '/pronouns_select':
				const choice = interaction.values[0];
				if (!isPronounValue(choice)) {
					await interaction.reply('Error: Invalid formatting');
					return;
				}
				const pn = new Pronoun(choice);
				const db = new Jsoning('botfiles/pronouns.db.json');
				await db.set(interaction.user.id, pn.toJSON());
				await interaction.reply({
					content: `User pronouns set: ${pn.value}`,
					ephemeral: true
				});
				break;
		}
	}
};
export default InteractionHandlers;
