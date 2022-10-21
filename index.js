'use strict';

const {
	ActivityType,
	Client,
	Collection,
	GatewayIntentBits,
} = require('discord.js');
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

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Keep in index
client.on('ready', () => {
	console.log('Client#ready fired.');
	client.user.setPresence({
		activities: [
			{
				name: '/coghelp',
				type: ActivityType.Custom,
			},
			{
				name: '/cheesetouch',
				type: ActivityType.Playing,
			},
		],
		status: 'online',
	});
});
// Keep in index
client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if (!command) return;
	try {
		await command.execute(interaction, client);
	} catch (e) {
		console.error(e);
		await interaction.reply({
			content: 'There was an error while running this command.',
			ephemeral: true,
		});
	}
});

client.login(TOKEN).catch((e) => console.log);

process.on('SIGINT', () => {
	client.destroy();
	console.log('Destroyed Client.');
	process.exit(0);
});

app.listen(8000);
