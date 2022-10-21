import * as discord from 'discord.js';
('use strict');
const { EmbedBuilder, Events, userMention } = discord;
export const name = Events.yourEvent;
export const once = false;
export const execute = async (o) => {
	console.log(o);
};
export default {
	name,
	once,
	execute,
};
