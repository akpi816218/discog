import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	inlineCode,
	SlashCommandBuilder,
} from 'discord.js';
import { devIds } from '../config.js';
('use strict');
export const data = new SlashCommandBuilder()
	.setName('global')
	.setDescription('Dev-only command')
	.addStringOption((option) => {
		return option
			.setName('messageid')
			.setDescription('The ID of the message')
			.setRequired(true);
	})
	.setDMPermission(true);

// ! Do NOT add command to `coghelp.ts`

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.reply('Working...');
	const messageid = interaction.options.getString('messageid');
	if (!interaction.channel) throw new Error();
	if (!devIds.includes(interaction.user.id) || !messageid) {
		await interaction.followUp('Restricted Commmand');
		return;
	}
	let message = await interaction.channel.messages.fetch(messageid.toString());
	if (typeof message == 'undefined') {
		await interaction.followUp('Invalid Message ID');
		return;
	}
	if (message.content.length == 0) {
		await interaction.followUp('No message content');
		return;
	}
	let badGuilds: string[] = [];
	interaction.client.guilds.cache.forEach(async (guild) => {
		guild.fetch();
		if (!guild.systemChannel) {
			await (
				await (await guild.fetchOwner()).createDM()
			).send(
				`Hi there! I'm part of your server called ${
					guild.name
				}. My developer just sent a global announcement to all my guilds, and I couldn't deliver it to yours because it didn't have a system channel. Go to ${inlineCode(
					'Server Settings > Overview > System Messages Channel'
				)} to choose a system channel. In the meantime, please use my ${inlineCode(
					'/announce'
				)} command to give everyone in your server the following message:\n${
					message.content
				}`
			);
			badGuilds.push(guild.name);
		} else {
			guild.systemChannel.send({
				content: '@everyone',
				embeds: [
					new EmbedBuilder()
						.setTitle('DisCog System Announcement')
						.setDescription(message.content)
						.setTimestamp()
						.setFooter({
							text: `Sent by ${interaction.user.tag}`,
							iconURL: interaction.user.displayAvatarURL(),
						}),
				],
			});
		}
	});
	await interaction.followUp(
		`Done. ${
			badGuilds.length == 0
				? 'All guilds recieved the announcement.'
				: `The following guilds did not recieve the announcement: ${badGuilds.join(
						', '
				  )}.`
		}`
	);
};
export default {
	data,
	execute,
};
