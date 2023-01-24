import { EmbedBuilder, inlineCode, time } from 'discord.js';
import { createTransport } from 'nodemailer';
import logger from './logger.js';
import Jsoning from 'jsoning';
import { Pronoun, PronounCodes, isPronounValue } from './struct/Pronouns.js';
export const InteractionHandlers = {
	async Button(interaction) {},
	ContextMenu: {
		async Message(interaction) {},
		async User(interaction) {
			const user = await interaction.targetUser.fetch(true);
			let mutfields = [];
			if (interaction.guild && interaction.targetMember) {
				mutfields.push({
					name: 'Server join date',
					value: time(interaction.targetMember.joinedAt || undefined),
				});
			}
			await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(user.hexAccentColor || null)
						.setTitle(`Who is ${user.tag}?`)
						.setThumbnail(user.displayAvatarURL())
						.addFields(
							{ name: 'ID:', value: user.id },
							{
								name: 'Discord join date:',
								value: time(user.createdAt),
							},
							{ name: 'Is bot?', value: user.bot.toString() }
						)
						.setTimestamp()
						.setFooter({
							text: 'Powered by DisCog',
							iconURL: interaction.client.user.displayAvatarURL(),
						})
						.addFields(mutfields),
				],
			});
		},
	},
	async ModalSubmit(interaction) {
		switch (interaction.customId) {
			case '/contact':
				let transport = createTransport({
					name: 'example.com',
					sendmail: true,
					path: '/usr/sbin/sendmail',
				});
				transport
					.sendMail({
						from: ``,
						to: [
							'Akhil Pillai <akhilzebra@gmail.com>, Akhil Pillai <816218@seq.org>',
						],
						subject: `DisCog Developer Contact Form ${interaction.user.tag} (${interaction.user.id})`,
						text: interaction.fields.getTextInputValue('/contact.text'),
					})
					.then((v) => logger.info(v));
				interaction.reply('Email sent.');
				break;
			case '/global':
				interaction.reply('Working...');
				const content = interaction.fields.getTextInputValue('/global.text');
				let badGuilds = [];
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
											),
									],
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
									text: `Sent by ${interaction.user.tag}`,
									iconURL: interaction.user.displayAvatarURL(),
								}),
						],
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
				const choice = interaction.fields.getTextInputValue(
					'/pronouns_modal_text'
				);
				if (!isPronounValue(choice)) {
					await interaction.reply('Error: Invalid formatting');
					return;
				}
				const pn = new Pronoun(PronounCodes.other, choice);
				const db = new Jsoning('pronouns.db.json');
				await db.set(interaction.user.id, pn.toJSON());
				await interaction.reply(`User pronouns set: ${pn.value}`);
				break;
		}
	},
	async StringSelectMenu(interaction) {
		switch (interaction.customId) {
			case '/pronouns_select':
				const choice = interaction.values[0];
				if (!isPronounValue(choice)) {
					await interaction.reply('Error: Invalid formatting');
					return;
				}
				const pn = new Pronoun(choice);
				const db = new Jsoning('pronouns.db.json');
				await db.set(interaction.user.id, pn.toJSON());
				await interaction.reply(`User pronouns set: ${pn.value}`);
				break;
			default:
				break;
		}
	},
};
export default InteractionHandlers;
