import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import TypedJsoning from 'typed-jsoning';
import { UserLevelingData } from '../struct/database';
import { unix } from 'dayjs';

export const data = new SlashCommandBuilder()
	.setName('levels')
	.setDescription('Leveling with XP!')
	.setDMPermission(false);

// ! Make sure to add command to `coghelp.ts`

export const execute = async (interaction: ChatInputCommandInteraction) => {
	const db = new TypedJsoning<UserLevelingData>('botfiles/levels.db.json'),
		user = db.get(interaction.user.id);
};

export function getXPForLevel(level: number) {
	return 3 * (level ** 3 + level ** 2 + level);
}

export function getLevelfromXP(xp: number): number {
	let level = 0;
	while (getXPForLevel(level) < xp) {
		level++;
	}
	if (getXPForLevel(level) > xp) {
		level--;
	}
	return level;
}
