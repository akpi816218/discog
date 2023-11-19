import { Events, Message } from 'discord.js';
import TypedJsoning from 'typed-jsoning';
import { UserLevelingData } from '../struct/database';
import { getLevelfromXP } from '../commands/levels';
import { baseEmbed } from '../struct/baseEmbed';
export const name = Events.MessageCreate;
export const once = false;

export const execute = async (message: Message) => {
	if (!message.inGuild() || message.author.bot) return;
	const db = new TypedJsoning<UserLevelingData>('botfiles/levels.db.json');
	const add = Math.ceil(Math.random() * 10 + 14),
		userData = db.get(message.author.id);
	const prevXP = userData?.xp ?? 0;
	if (
		!userData ||
		message.createdTimestamp > userData.lastCountedMessageTimestamp + 10_000
	)
		await db.set(message.author.id, {
			lastCountedMessageTimestamp: message.createdTimestamp,
			xp: prevXP + add
		});
	else return;
	const currentLevel = getLevelfromXP(prevXP + add),
		prevLevel = getLevelfromXP(prevXP);
	if (currentLevel === prevLevel) return;
	message.reply({ embeds: [baseEmbed()] });
};
