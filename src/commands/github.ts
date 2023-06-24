import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder
} from 'discord.js';
import { Octokit } from 'octokit';

export const data = new SlashCommandBuilder()
	.setName('name')
	.setDescription('description');

// ! Make sure to add command to `coghelp.ts`

const BaseEmbed = new EmbedBuilder()
		.setColor('White')
		.setDescription('Fetching data from GitHub, please wait...')
		.setTimestamp(),
	OctoKit = new Octokit({ userAgent: 'DisCog' });
const Handlers: {
	// eslint-disable-next-line no-unused-vars
	[key: string]: (interaction: ChatInputCommandInteraction) => unknown;
} = {
	profile: async (interaction: ChatInputCommandInteraction) => {
		await interaction.reply({
			embeds: [BaseEmbed.setTitle('Github | Profile')]
		});
		const { data } = await OctoKit.rest.users.getByUsername({
			username: interaction.options.getString('username', true)
		});
		if (!data.id)
			await interaction.editReply({
				embeds: [
					BaseEmbed.setDescription(null)
						.setFields(
							{
								name: 'Name',
								value: data.name ?? 'Not Provided'
							},
							{
								name: 'Followers',
								value: data.followers.toString()
							},
							{
								name: 'Following',
								value: data.following.toString()
							},
							{
								name: 'Join Date',
								value: new Date(data.created_at).toString()
							}
						)
						.setThumbnail(data.avatar_url)
						.setFooter({
							iconURL: interaction.client.user.displayAvatarURL(),
							text: 'Powered by DisCog'
						})
				]
			});
	},
	repos: async (interaction: ChatInputCommandInteraction) => {},
	stats: async (interaction: ChatInputCommandInteraction) => {},
	timeline: async (interaction: ChatInputCommandInteraction) => {}
};

export const execute = async (interaction: ChatInputCommandInteraction) =>
	await Handlers[interaction.options.getSubcommand(true)](interaction);
