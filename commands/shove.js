const { SlashCommandBuilder, spoiler, userMention } = require('discord.js');

// ! When creating a new command, be sure to add it to `coghelp.js` in the `field` object.

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shove')
		.setDescription('Shove someone')
		.addUserOption((option) => {
			return option
				.setName('user')
				.setDescription('The user to shove')
				.setRequired(true);
		}),
	execute: async (interaction) => {
		const a = userMention(interaction.user.id),
			b = userMention(interaction.options.getUser('user').id);
		const r = [
			`${a} shoved ${b} so far down the sewer that it took a team of plumbers to retrieve them`,
			`${a} shoved ${b} so hard up a chimney that they needed two years to climb down`,
			`${a} shoved ${b} so far down a toilet that it took a scuba diving team and a plumber to get them out`,
			`${a} shoved ${b} so violently that they lost all 5 (6?) of their limbs`,
			`${a} shoved ${b} so far up Microsoft's a** that all their servers got overloaded`,
			`${a} shoved ${b} so far up Apple's a** that all their iPhones got infected with malware`,
			`${a} shoved ${b} so hard into Leafy's backpack that they needed the FBI and a search and rescue team`,
			`${a} shoved ${b} into a trash can and sent them home`,
			`${a} shoved ${b} out of a plane and into the clouds... Now their head's in the clouds`,
			`${a} shoved ${b} up a hole in the ground (screw physics)`,
			`${a} shoved ${b} into ${spoiler('UR MOM')}`,
			`${a} shoved ${b} into ${spoiler('DEEZ NUTZ')}`,
			`${a} shoved ${b}	into ${spoiler('themselves')}`,
			`${a} shoved ${b} so far into a certain viola that it had to be taken to Clock Tower Music to get fixed`,
		];
		await interaction.reply(r[Math.floor(Math.random()*r.length)]);
	},
};
