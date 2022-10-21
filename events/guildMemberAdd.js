'use strict';

const { Events, userMention, GuildMember } = require('discord.js');

module.exports = {
	name: Events.GuildMemberAdd,
	once: false,
	/**
	 * @param {GuildMember} member
	 */
	execute: async (member) => {
		if (member.guild.rulesChannel) {
			await member.guild.systemChannel.send(
				`Welcome to ${member.guild.name}, ${userMention(member.id)}! (Member #${
					member.guild.memberCount
				})`
			);
		}
	},
};
