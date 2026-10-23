import {
	ChatInputCommandInteraction,
	InteractionContextType,
	SlashCommandBuilder,
	Snowflake
} from 'discord.js';
import { isDeveloper } from '../../lib/redis';

export const data = new SlashCommandBuilder()
	.setName('exo')
	.setDescription('beep boop')
	.setContexts(InteractionContextType.Guild);

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.deferReply({
		ephemeral: true
	});

	if (!(await isDeveloper(interaction.user.id))) {
		await interaction.editReply('You are not a developer');
		return;
	}

	const memberData = Object.fromEntries(
		(await interaction.guild!.members.fetch()).map((member) => [
			member.id as Snowflake,
			{
				nickname: member.nickname,
				roles: member.roles.cache.map((role) => ({
					id: role.id,
					name: role.name,
					color: role.hexColor
				}))
			}
		])
	);

	await interaction.editReply('Exporting member data to DM...');

	await interaction.user.send({
		content: 'Here is the exported member data:',
		files: [
			{
				attachment: Buffer.from(JSON.stringify(memberData, null, 2)),
				name: 'memberData.json'
			}
		]
	});

	await interaction.editReply('Success');
};
