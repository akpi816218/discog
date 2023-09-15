import {
	EmbedBuilder,
	Events,
	Guild,
	inlineCode,
	underscore
} from 'discord.js';

export const name = Events.GuildCreate;
export const once = false;
export const execute = async (guild: Guild) => {
	if (guild.systemChannel)
		guild.systemChannel.send({
			embeds: [
				new EmbedBuilder()
					.setColor(0x0f0)
					.setTitle('DisCog is here!')
					.setDescription(
						`DisCog is a general purpose Discord bot. Use ${inlineCode(
							'/coghelp'
						)} or view my profile to find out what I can do!\n${underscore(
							`Admins, be sure to check out the ${inlineCode(
								'/admin'
							)} command! This slash command is already restricted to admins, so you don't need to worry about that.`
						)}`
					)
					.setTimestamp()
			]
		});
};
