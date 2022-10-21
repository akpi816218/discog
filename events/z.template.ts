'use strict';

const { EmbedBuilder, Events, userMention } = require('discord.js');

module.exports = {
	// ! Edit the event type
	name: Events.yourEvent,
	once: false,
	/**
	 * @param {Object} o
	 */
	execute: async (o) => {
		console.log(o);
	},
};
