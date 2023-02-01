('use strict');
import logger from './logger.js';
console.log('RunID: %d', Math.floor(Math.random() * 100));
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import './interactionHandlers.js';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { inviteLink } from './config.js';
import TOKEN from './TOKEN.js';
import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import InteractionHandlers from './interactionHandlers.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.get('/', (_req, res) => {
	res.status(200).end();
});
app.get('/invite', (_req, res) => {
	res.redirect(inviteLink);
});
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildScheduledEvents
	]
});
client.on('debug', console.log).on('warn', console.log);
let g = {
	commands: new Collection()
};
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter((file) =>
	file.endsWith('.js')
);
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = await import(filePath);
	g.commands.set(command.data.name, command);
}
const eventsPath = path.join(__dirname, 'events');
const eventFiles = readdirSync(eventsPath).filter((file) =>
	file.endsWith('.js')
);
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = await import(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
// Keep in index
client
	.on(Events.ClientReady, (readyClient) => {
		logger.info('Client#ready');
		readyClient.user.setPresence({
			status: 'online'
		});
	})
	.on(Events.InteractionCreate, async (interaction) => {
		if (interaction.isChatInputCommand()) {
			const command = g.commands.get(interaction.commandName);
			try {
				await command.execute(interaction);
			} catch (e) {
				console.error(e);
				await interaction.reply({
					content: 'There was an error while running this command.',
					ephemeral: true
				});
			}
		} else if (interaction.isModalSubmit())
			InteractionHandlers.ModalSubmit(interaction);
		else if (interaction.isButton()) InteractionHandlers.Button(interaction);
		else if (interaction.isUserContextMenuCommand())
			InteractionHandlers.ContextMenu.User(interaction);
		else if (interaction.isMessageContextMenuCommand())
			InteractionHandlers.ContextMenu.Message(interaction);
		else if (interaction.isStringSelectMenu())
			InteractionHandlers.StringSelectMenu(interaction);
	})
	.on(Events.Debug, (m) => logger.debug(m))
	.on(Events.Error, (m) => logger.error(m))
	.on(Events.Warn, (m) => logger.warn(m));
await client.login(TOKEN);
process.on('SIGINT', () => {
	client.destroy();
	console.log('Destroyed Client.');
	process.exit(0);
});
app.listen(8000);
