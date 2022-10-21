import { Events } from 'discord.js';
('use strict');
export const name = Events.GuildCreate;
export const once = false;
export const execute = async (guild) => {
	guild.systemChannel.send(
		new EmbedBuilder()
			.setColor(0x0f0)
			.setTitle('DisCog is here!')
			.setDescription(
				`DisCog is a general purpose Discord bot. Use ${inlineCode(
					'/coghelp'
				)} or view my profile to find out what I can do!`
			)
			.setTimestamp()
	);
};
export default {
	name,
	once,
	execute,
};
