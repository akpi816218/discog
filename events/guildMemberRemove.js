'use strict';

const { Events, userMention, GuildMember } = require('discord.js');

module.exports = {
	name: Events.GuildMemberRemove,
	once: false,
	/**
	 * @param {GuildMember} member
	 */
	execute: async (member) => {
		await member.guild.systemChannel.send(
			`${userMention(member.id)} just poofed.`
		);
	},
};
