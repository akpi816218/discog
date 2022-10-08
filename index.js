const {
	ActivityType,
	Client,
	Collection,
	GatewayIntentBits,
	EmbedBuilder,
	inlineCode,
} = require('discord.js');
const { writeFileSync } = require('node:fs');
const fs = require('node:fs');
const path = require('node:path');
const { applicationId, clientId, inviteLink } = require('./config.json');
const { TOKEN } = require('./TOKEN.json');

const app = require('express')();
app.get('/', (req, res) => {
	res.send('foof');
});
app.get('/invite', (req, res) => {
	res.redirect(inviteLink);
});

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.on('ready', () => {
	console.log('Client#ready fired.');
	client.user.setPresence({
		activities: [
			{
				name: '/coghelp',
				type: ActivityType.Playing,
			},
		],
		status: 'online',
	});
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (e) {
		console.error(e);
		await interaction.reply({
			content: 'There was an error while running this command.',
			ephemeral: true,
		});
	}
});

client.on('guildCreate', async (guild) => {
	guild.systemChannel.send(
		new EmbedBuilder()
			.setColor(0x0f0)
			.setTitle('DisCog is here!')
			.setDescription(
				`DisCog is a general purpose Discord bot. Type ${inlineCode(
					'/coghelp'
				)} to find out what I can do!`
			)
			.setTimestamp()
	);
});

client.login(TOKEN).catch((e) => console.log);

app.listen(8000);
