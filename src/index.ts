import {
	ChatInputCommandInteraction,
	Client,
	Collection,
	Events,
	GatewayIntentBits
} from 'discord.js';
import { InteractionHandlers } from './interactionHandlers.js';
import TOKEN from './TOKEN.js';
import { dirname } from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import { inviteLink } from './config.js';
import logger from './logger.js';
import path from 'node:path';
import { readdirSync } from 'node:fs';

// eslint-disable-next-line no-console
console.log('RunID: %d', Math.floor(Math.random() * 100));

// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.get('/', (_req: any, res: any) => {
	res.status(200).end();
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.get('/invite', (_req: any, res: any) => {
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

// eslint-disable-next-line no-console
client.on('debug', console.log).on('warn', console.warn);

const g = {
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
			interface Command {
				// eslint-disable-next-line no-unused-vars
				execute: (interaction: ChatInputCommandInteraction) => unknown;
			}
			const command = g.commands.get(interaction.commandName) as Command;
			try {
				await command.execute(interaction);
			} catch (e) {
				// eslint-disable-next-line no-console
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
	// eslint-disable-next-line no-console
	console.log('Destroyed Client.');
	process.exit(0);
});

app.listen(8000);
