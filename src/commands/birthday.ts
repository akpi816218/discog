/* eslint-disable indent */
import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
	userMention
} from 'discord.js';
import Jsoning from 'jsoning';

export const data = new SlashCommandBuilder()
	.setName('birthday')
	.setDescription("Register your birthdate or view another's")
	.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('register')
			.setDescription('Register your birthday')
			.addIntegerOption((option) => {
				return option
					.setName('month')
					.setDescription('Month of birth')
					.setMinValue(1)
					.setMaxValue(12)
					.setRequired(true);
			})
			.addIntegerOption((option) => {
				return option
					.setName('date')
					.setDescription('Date of birth')
					.setMinValue(1)
					.setMaxValue(31)
					.setRequired(true);
			})
			.addIntegerOption((option) => {
				return option
					.setName('year')
					.setDescription('Year of birth')
					.setMinValue(1)
					.setMaxValue(new Date().getFullYear())
					.setRequired(true);
			})
	)
	.addSubcommand(
		new SlashCommandSubcommandBuilder()
			.setName('view')
			.setDescription("View someone's birthday")
			.addUserOption((option) => {
				return option
					.setName('user')
					.setDescription('User to view birthday')
					.setRequired(false);
			})
	);

// ! Make sure to add command to `coghelp.ts`

export const execute = async (interaction: ChatInputCommandInteraction) => {
	const db = new Jsoning('botfiles/bday.db.json');
	switch (interaction.options.getSubcommand()) {
		case 'register':
			await interaction.deferReply({
				ephemeral: true
			});
			const bday = new Date();
			bday.setFullYear(
				interaction.options.getInteger('year', true),
				interaction.options.getInteger('month', true) - 1,
				interaction.options.getInteger('date', true)
			);
			await db.set(interaction.user.id, bday.toLocaleDateString());
			await interaction.editReply({
				content: `Your birthday is set to ${bday.toLocaleDateString()}`
			});
			break;
		case 'view':
			await interaction.deferReply();
			const id = interaction.options.getUser('user')?.id ?? interaction.user.id;
			const ubday = db.get(id);
			if (!ubday)
				await interaction.editReply({
					embeds: [
						new EmbedBuilder()
							.setTitle('User Birthday')
							.setDescription(
								`${userMention(id)} has not registered their birthday.`
							)
							.setFooter({
								iconURL: interaction.client.user.displayAvatarURL(),
								text: 'Powered by DisCog'
							})
					]
				});
			else
				await interaction.editReply({
					embeds: [
						new EmbedBuilder()
							.setTitle('User Birthday')
							.setDescription(
								`${userMention(id)}'s birthday is on ${db.get(ubday)}.`
							)
							.setFooter({
								iconURL: interaction.client.user.displayAvatarURL(),
								text: 'Powered by DisCog'
							})
					]
				});
			break;
	}
};
